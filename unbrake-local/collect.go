package main

import (
	"log"
	"strconv"
	"strings"
	"time"

	emitter "github.com/icaropires/go/v2"
)

var (
	port             Port
	serialPortNameCh = make(chan string, 1)
	serialAttrs      = make([]SerialAttribute, numSerialAttrs)
)

// Index of information get on reading from serial
const (
	frequencyIdx = iota
	temperature1Idx
	temperature2Idx
	brakingForce1Idx
	brakingForce2Idx
	vibrationIdx
	speedIdx
	pressureIdx
	currentSnubIdx
)

var data [][]string

// Subchannels for each information sent to MQTT, same index rules
// as the original data string from serial
var mqttSubchannelSerialAttrs = []string{
	"/frequency",
	"/temperature/sensor1",
	"/temperature/sensor2",
	"/brakingForce/sensor1",
	"/brakingForce/sensor2",
	"/vibration",
	"/speed",
	"/pressure",
}

const (
	mqttSubchannelCurrentSnub = "/currentSnub"
	mqttSubchannelSnubState   = "/snubState"
	mqttSubchannelIsAvailable = "/isAvailable"
)

// SerialAttribute represent one attributes of the many that are returned as values
// from the physical device on serial communication
type SerialAttribute struct {
	mqttSubchannel string       // Subchannel associated at mqtt broker
	publishCh      chan string  // for publishing
	handleCh       chan float64 // for handling values
}

// CollectData will collect data from serial bus and distributes it to others goroutines
func CollectData() {
	defer wgGeneral.Done()

	var ReadingDelay = time.Second / frequencyReading

	continueCollecting := true
	for continueCollecting {
		aplicationStatusCh <- "Esperando seleção de porta válida"
		log.Println("Waiting for valid serial port selection...")
		serialPortName := <-serialPortNameCh

		err := port.Open(serialPortName)

		if err != nil {
			log.Println(err)
			continue
		}

		aplicationStatusCh <- "Coletando dados"

		testSerialConnection()

		log.Println("Initializing collectData routine...")
		log.Printf("Simulator Port = %s", serialPortName)
		log.Printf("Buffer size = %d", bufferSize)
		log.Printf("Baud rate = %d", baudRate)
		log.Printf("Reading delay = %v", ReadingDelay)

		for {
			select {
			case stop := <-stopCollectingDataCh:
				if stop {
					continueCollecting = false
				}
			case sig := <-sigsCh:
				log.Println("Signal received: ", sig)

				continueCollecting = false
			case serialPortName = <-serialPortNameCh:
				serialPortNameCh <- serialPortName
				CollectData()
			default:
				getData("\"")
				time.Sleep(ReadingDelay)
			}
		}
	}
}

// Will get the data from the bus and returns it as an
// array of bytes
func getData(command string) []byte {

	numberOfDataToFilter := 50

	n := port.Write([]byte(command))
	if n == -1 {
		log.Println("Error writing to serial. Is this the right port?")
		aplicationStatusCh <- "Selecione a porta correta"
	}

	buf := make([]byte, bufferSize)
	n, err := port.Read(buf)
	if err != nil {
		log.Println("Error reading from serial ", err, ". Is this the right port?")
		aplicationStatusCh <- "Selecione a porta correta"
	} else if n == 0 {
		log.Println("Error reading from serial: timeout waiting for bytes. Is this the right port?")
		aplicationStatusCh <- "Selecione a porta correta"
	}

	split := strings.Split(string(buf[:n]), ",")

	if len(split) == numSerialAttrs { // Was a complete read

		data = append(data, split)

		if len(data) == numberOfDataToFilter {

			split = dataFilter(data)

			out := strings.Join(split, ", ")

			log.Println(out)

			for i, attr := range split {
				attrValue, _ := strconv.ParseFloat(attr, 64)

				select {
				case serialAttrs[i].handleCh <- attrValue:
				default:
				}

				select {
				case serialAttrs[i].publishCh <- attr:
				default:
				}
			}
			data = data[:0]
		}
	}

	return buf
}

func convertTemperature(value float64, convertionFactor float64, offset float64) float64 {
	const (
		maxDigitalSignalValue = 1023
		milliVots             = 5000
	)
	value = (value * milliVots) / maxDigitalSignalValue
	return value*convertionFactor + offset
}

func convertSpeed(value float64, tireRadius float64) float64 {
	const (
		maxDigitalSignalValue = 1023
		milliVots             = 5000
	)

	value = (value * milliVots) / maxDigitalSignalValue
	return value * tireRadius
}

func dataFilter(data [][]string) []string {

	var (
		out         []string
		counter     int
		intValue    int
		stringValue string
	)

	for i := 0; i < numSerialAttrs; i++ {
		for j := 0; j < len(data); j++ {
			intValue, _ = strconv.Atoi(data[j][i])
			counter += intValue
		}
		stringValue = strconv.Itoa(counter / len(data))
		out = append(out, stringValue)
		counter = 0
	}
	return out
}

func tireRadius(transversalSelectionWidth int, heightWidthRelation int, rimDiameter int) float64 {
	return float64((transversalSelectionWidth*heightWidthRelation)/100000) + (0.0254*float64(rimDiameter))/2
}

// Publish to MQTT broker the whole current state of local application
func publishSerialAttrs() {
	for i := 0; i < numSerialAttrs; i++ {
		go func(idx int) {
			for {
				publishData(<-serialAttrs[idx].publishCh, serialAttrs[idx].mqttSubchannel)
			}
		}(i)
	}
}

// Publish data to MQTT broker
func publishData(data string, subChannel string) {

	if key := getMqttKey(); key != "" {

		clientWriting.OnError(func(_ *emitter.Client, err emitter.Error) {
			mqttHasWritingPermission = false
		})

		channel, data := getMqttChannelPrefix()+subChannel, data
		clientWriting.Publish(key, channel, data)

	} else {
		log.Println("MQTT key not set!!! Not publishing any data...")
		mqttKeyStatusCh <- "Chave do MQTT: Ausente"
		return
	}
}

func writeDutyCycle(duty float64) {

	asciiBase := 75.0
	perCentByAcii := 4.0

	var command []byte

	command = append(command, byte(int(duty/perCentByAcii+asciiBase)))

	n := port.Write(command)
	if n == -1 {

		log.Println("Error writing to serial. Is this the right port?")
		aplicationStatusCh <- "Selecione a porta correta"
	}

}

func testSerialConnection() {

	firmware := "Braketestbench"

	n := port.Write([]byte(" "))
	if n == -1 {
		log.Println("Error writing to serial. Is this the rigth port?")
		aplicationStatusCh <- "Selecione a porta correta"
	}

	buf := make([]byte, bufferSize)
	n, err := port.Read(buf)
	if err != nil {
		log.Println("Error reading from serial ", err, ". Is this the right port?")
		aplicationStatusCh <- "Selecione a porta correta"
	} else if n == 0 {
		log.Println("Error reading from serial: timeout waiting for bytes. Is this the right port?")
		aplicationStatusCh <- "Selecione a porta correta"
	}

	buf = buf[2:16]

	if string(buf) != firmware {
		log.Println("Wrong serial port selected")
		aplicationStatusCh <- "Selecione a porta correta"
	}

}

func testKeys() {

	log.Println("Testing MQTT keys...")

	key := getMqttKey()
	var channel = getMqttChannelPrefix() + "/testingKeys"

	clientReading.OnError(func(_ *emitter.Client, err emitter.Error) {
		mqttHasReadingPermission = false
	})

	clientReading.Subscribe(key, channel, func(_ *emitter.Client, msg emitter.Message) {
		mqttHasReadingPermission = true
	})

	publishData("testing", "/testingKeys")

	if mqttHasWritingPermission {
		if mqttHasReadingPermission {
			mqttKeyStatusCh <- "Chave de acesso: Válida"
		} else {
			mqttKeyStatusCh <- "Chave de acesso: Válida apenas para escrita"
		}
	} else {
		if mqttHasReadingPermission {
			mqttKeyStatusCh <- "Chave de acesso: Válida apenas para leitura"
		} else {
			mqttKeyStatusCh <- "Chave de acesso: Inválida"
		}
	}
	return

}
