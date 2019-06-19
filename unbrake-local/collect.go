package main

import (
	"log"
	"strconv"
	"strings"
	"time"

	emitter "github.com/emitter-io/go/v2"
	"github.com/tarm/serial"
)

var (
	port             *serial.Port
	serialPortNameCh = make(chan string, 1)
	serialPortCh     = make(chan *serial.Port)
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
		aplicationStatusCh <- "Waiting for port selection"
		log.Println("Waiting for valid serial port selection...")
		serialPortName := <-serialPortNameCh

		configuration := &serial.Config{
			Name:        serialPortName,
			Baud:        baudRate,
			ReadTimeout: time.Second,
		}

		port, err := serial.OpenPort(configuration)

		if err == nil {
			serialPortCh <- port
		} else {
			log.Println(err)
			continue
		}

		aplicationStatusCh <- "Collecting data"

		log.Println("Initializing collectData routine...")
		log.Printf("Simulator Port = %s", serialPortName)
		log.Printf("Buffer size = %d", bufferSize)
		log.Printf("Baud rate = %d", baudRate)
		log.Printf("Reading delay = %v", ReadingDelay)

		port.Flush()
		for {
			select {
			case stop := <-stopCollectingDataCh:
				if stop {
					snub.SetState(cooldown)
					continueCollecting = false
				}
			case sig := <-sigsCh:
				log.Println("Signal received: ", sig)

				continueCollecting = false
			case serialPortName = <-serialPortNameCh:
				serialPortNameCh <- serialPortName
				CollectData()
			default:
				getData(port, "\"")
				time.Sleep(ReadingDelay)
			}
		}
	}
}

// Will get the data from the bus and returns it as an
// array of bytes
func getData(port *serial.Port, command string) []byte {
	n, err := port.Write([]byte(command))
	if err != nil {
		log.Println("Error writing to serial ", err, ". Is this the right port?")
	}

	buf := make([]byte, bufferSize)
	if n, err = port.Read(buf); err != nil {
		log.Println("Error reading from serial ", err, ". Is this the right port?")
	} else if n == 0 {
		log.Println("Error reading from serial: timeout waiting for bytes. Is this the right port?")
	}

	log.Printf("%s\n", strings.TrimSpace(string(buf[:n])))
	split := strings.Split(string(buf[:n]), ",")

	if len(split) == numSerialAttrs { // Was a complete read
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
	}

	return buf
}

func convertTemperature(value float64, convertionFactor float64, offset float64) float64 {
	return value*convertionFactor + offset
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
		channel, data := getMqttChannelPrefix()+subChannel, data

		client, _ := emitter.Connect(getMqttHost(), func(_ *emitter.Client, msg emitter.Message) {
			log.Printf("Sent message: '%s' topic: '%s'\n", msg.Payload(), msg.Topic())
		})

		client.OnError(func(_ *emitter.Client, err emitter.Error) {
			mqttKeyStatusCh <- "Chave do MQTT: Sem permissão de escrita"
		})

		client.Publish(key, channel, data)

	} else {
		log.Println("MQTT key not set!!! Not publishing any data...")
		mqttKeyStatusCh <- "Chave do MQTT: Ausente"
		return
	}
}
