package main

import (
	"encoding/json"
	"log"
	"strconv"
	"sync"
	"time"

	emitter "github.com/emitter-io/go/v2"
)

// Global snub which represents state of running test
var snub = Snub{state: acelerating}

// Status flags
var (
	mqttHasWritingPermission bool
	mqttHasReadingPermission bool
)

var (
	upperSpeedLimit                   float64
	lowerSpeedLimit                   float64
	timeSleepWater                    float64
	timeCooldown                      int
	temperatureLimit                  float64
	delayAcelerateToBrake             int
	totalOfSnubs                      int
	firstConversionFactorTemperature  float64
	secondConversionFactorTemperature float64
	firstOffsetTemperature            float64
	secondOffsetTemperature           float64
	currentSnub                       = 1
)

var wgExperiment sync.WaitGroup

// ExperimentData represents data needed for performing a experiment
type ExperimentData struct {
	Model  string `json:"model"`
	Pk     int    `json:"pk"`
	Fields struct {
		CreateBy    string `json:"create_by"`
		Calibration struct {
			Name      string `json:"name"`
			IsDefault bool   `json:"is_default"`
			Vibration struct {
				AcquisitionChanel int     `json:"acquisition_chanel"`
				ConversionFactor  float64 `json:"conversion_factor"`
				VibrationOffset   float64 `json:"vibration_offset"`
			} `json:"vibration"`
			Speed struct {
				AcquisitionChanel int     `json:"acquisition_chanel"`
				TireRadius        float64 `json:"tire_radius"`
			} `json:"speed"`
			Relations struct {
				TransversalSelectionWidth int `json:"transversal_selection_width"`
				HeigthWidthRelation       int `json:"heigth_width_relation"`
				RimDiameter               int `json:"rim_diameter"`
				SyncMotorRodation         int `json:"sync_motor_rodation"`
				SheaveMoveDiameter        int `json:"sheave_move_diameter"`
				SheaveMotorDiameter       int `json:"sheave_motor_diameter"`
			} `json:"relations"`
			Command struct {
				CommandChanelSpeed    int     `json:"command_chanel_speed"`
				ActualSpeed           float64 `json:"actual_speed"`
				MaxSpeed              float64 `json:"max_speed"`
				ChanelCommandPression int     `json:"chanel_command_pression"`
				ActualPression        float64 `json:"actual_pression"`
				MaxPression           float64 `json:"max_pression"`
			} `json:"command"`
			Temperature []struct {
				AcquisitionChanel int     `json:"acquisition_chanel"`
				ConversionFactor  float64 `json:"conversion_factor"`
				TemperatureOffset float64 `json:"temperature_offset"`
				Calibration       int     `json:"calibration"`
			} `json:"temperature"`
			Force []struct {
				AcquisitionChanel int     `json:"acquisition_chanel"`
				ConversionFactor  float64 `json:"conversion_factor"`
				ForceOffset       float64 `json:"force_offset"`
				Calibration       int     `json:"calibration"`
			} `json:"force"`
		} `json:"calibration"`
		Configuration struct {
			Name              string  `json:"name"`
			IsDefault         bool    `json:"is_default"`
			Number            int     `json:"number"`
			TimeBetweenCycles int     `json:"time_between_cycles"`
			UpperLimit        int     `json:"upper_limit"`
			InferiorLimit     int     `json:"inferior_limit"`
			UpperTime         int     `json:"upper_time"`
			LowerTime         int     `json:"inferior_time"`
			DisableShutdown   bool    `json:"disable_shutdown"`
			EnableOutput      bool    `json:"enable_output"`
			Temperature       float64 `json:"temperature"`
			Time              float64 `json:"time"`
		} `json:"configuration"`
	} `json:"fields"`
}

// Snub is a cycle of aceleration, braking and cooldown,
// multiple snubs compose a test
type Snub struct {
	state     string
	isWaterOn bool
	mux       sync.Mutex
}

// Flags with intermediary states
var (
	stabilizing = false
	enableWater bool
	isAvailable bool
)

// Possible states of a snub, value is ascii which
// represents its state
const (
	cooldown                = string(iota + '$') //'$'
	acelerating                                  //'%'
	braking                                      //'&'
	aceleratingBraking                           //'''
	cooldownWater                                //'('
	aceleratingWater                             //')'
	brakingWater                                 //'*'
	aceleratingBrakingWater                      //'+'
)

// Mapping current state to next state
var currentToNextState = map[string]string{
	acelerating:      braking,
	braking:          cooldown,
	cooldown:         acelerating,
	aceleratingWater: brakingWater,
	brakingWater:     cooldownWater,
	cooldownWater:    aceleratingWater,
}

// Regular state to matching state but throwing water
var offToOnWater = map[string]string{
	acelerating:      aceleratingWater,
	braking:          brakingWater,
	cooldown:         cooldownWater,
	aceleratingWater: aceleratingWater,
	brakingWater:     brakingWater,
	cooldownWater:    cooldownWater,
}

// From a throwing water state to a regular state
var onToOffWater = map[string]string{
	aceleratingWater: acelerating,
	brakingWater:     braking,
	cooldownWater:    cooldown,
	acelerating:      acelerating,
	braking:          braking,
	cooldown:         cooldown,
}

// Ascii character which represents state to state name
var byteToStateName = map[string]string{
	"$":  "cooldown",
	"%":  "acelerating",
	"&":  "braking",
	"\"": "aceleratingBraking",
	"(":  "cooldownWater",
	")":  "aceleratingWater",
	"*":  "brakingWater",
	"+":  "aceleratingBrakingWater",
}

// NextState change state of snub to next corresponding in duty cycle
func (snub *Snub) NextState() {
	snub.mux.Lock()
	defer snub.mux.Unlock()

	snub.changeState()

	switch snub.state {

	case acelerating: // Next is Braking
		stabilizing = true

		log.Println("Stabilizing...")
		time.Sleep(time.Second * time.Duration(delayAcelerateToBrake))

		stabilizing = false

	case braking: // Next is Cooldown
		time.Sleep(time.Second * time.Duration(timeCooldown))

	case cooldown: // Next is acelerate, end of a cycle
		currentSnub++
		publishData(strconv.Itoa(currentSnub), mqttSubchannelCurrentSnub)

		log.Println("---> End of snub <---")

		if currentSnub > totalOfSnubs {
			handleExperimentEnd()
		}
	}
}

var teste = make(chan bool, 1)

func runExperiment(s string) {
	teste <- true

	var data ExperimentData
	if err := json.Unmarshal([]byte(s), &data); err != nil {
		log.Println("Wasn't possible to decode JSON, error: ", err)
	}

	totalOfSnubs = 2      //data.Fields.Configuration.Number
	upperSpeedLimit = 150 //data.Fields.Configuration.UpperLimit
	lowerSpeedLimit = 150 //data.Fields.Configuration.InferiorLimit
	timeSleepWater = data.Fields.Configuration.Time
	delayAcelerateToBrake = data.Fields.Configuration.UpperTime
	timeCooldown = data.Fields.Configuration.LowerTime
	temperatureLimit = 400 //data.Fields.Configuration.Temperature
	enableWater = false    //data.Fields.Configuration.EnableOutput
	firstConversionFactorTemperature = data.Fields.Calibration.Temperature[0].ConversionFactor
	secondConversionFactorTemperature = data.Fields.Calibration.Temperature[1].ConversionFactor
	firstOffsetTemperature = data.Fields.Calibration.Temperature[0].TemperatureOffset
	secondOffsetTemperature = data.Fields.Calibration.Temperature[1].TemperatureOffset

	log.Printf("totalOfSnubs: %v\n", totalOfSnubs)
	log.Printf("upperSpeedLimit: %v\n", upperSpeedLimit)
	log.Printf("lowerSpeedLimit: %v\n", lowerSpeedLimit)
	log.Printf("timeSleepWater: %v\n", timeSleepWater)
	log.Printf("delayAcelerateToBrake: %v\n", delayAcelerateToBrake)
	log.Printf("timeCooldown: %v\n", timeCooldown)
	log.Printf("temperatureLimit: %v\n", temperatureLimit)
	log.Printf("conversionFactorTemperature: %v\n", firstConversionFactorTemperature)
	log.Printf("offsetTemperature: %v\n", firstOffsetTemperature)

	wgExperiment.Add(1)
	isAvailable = false

	watchSnubState()
	if _, err := port.Write([]byte(cooldown)); err != nil {
		log.Fatal(err)
	}
	publishData(byteToStateName[snub.state], mqttSubchannelSnubState)

	isAvailable = true
	wgExperiment.Wait()
	<-teste
}

func handleExperimentEnd() {
	currentSnub = 1
	snub.state = cooldown

	publishData(strconv.Itoa(currentSnub), mqttSubchannelCurrentSnub)
	wgExperiment.Done()
}

func (snub *Snub) changeState() {
	oldState := snub.state
	snub.state = currentToNextState[snub.state]

	if _, err := port.Write([]byte(snub.state)); err != nil {
		log.Println("Wasn't possible to write the state: ", err)
	}

	publishData(byteToStateName[snub.state], mqttSubchannelSnubState)
	log.Printf("Change state: %v ---> %v\n", byteToStateName[oldState], byteToStateName[snub.state])
}

func (snub *Snub) changeStateWater() {
	snub.mux.Lock()
	defer snub.mux.Unlock()

	oldState := snub.state

	snub.isWaterOn = !snub.isWaterOn

	if !snub.isWaterOn {
		snub.state = offToOnWater[snub.state]
		log.Printf("Turn on water(%vs): %v ---> %v\n", timeSleepWater, byteToStateName[oldState], byteToStateName[snub.state])
	} else {
		time.Sleep(time.Second * time.Duration(timeSleepWater))
		snub.state = onToOffWater[snub.state]
		log.Printf("Turn off water: %v ---> %v\n", byteToStateName[oldState], byteToStateName[snub.state])
	}

	if _, err := port.Write([]byte(snub.state)); err != nil {
		log.Println("Wasn't possible to write the state: ", err)
	}

	publishData(byteToStateName[snub.state], mqttSubchannelSnubState)
	log.Printf("Turn on water(%vs): %v ---> %v\n", timeSleepWater, byteToStateName[oldState], byteToStateName[snub.state])
}

// Will manage the state of running snub, handling all state transitions,
// synchronization, collecting needed data and writing needed commands
func watchSnubState() {
	go watchSpeed()
	go watchTemperature()
}

// Watchs speed, changing state when necessary
func watchSpeed() {
	for {
		speed := <-serialAttrs[speedIdx].handleCh

		if (snub.state == acelerating || snub.state == aceleratingWater) && !stabilizing {
			if speed >= upperSpeedLimit {
				snub.NextState()
			}
		} else if snub.state == braking || snub.state == brakingWater {
			if speed < lowerSpeedLimit {
				snub.NextState()
			}
		}
	}
}

// Follow temperature and throw water if needed
func watchTemperature() {
	for {
		temperature1 := convertTemperature(<-serialAttrs[temperature1Idx].handleCh, firstConversionFactorTemperature, firstOffsetTemperature)
		temperature2 := convertTemperature(<-serialAttrs[temperature2Idx].handleCh, secondConversionFactorTemperature, secondOffsetTemperature)

		if (temperature1 > temperatureLimit || temperature2 > temperatureLimit) && enableWater {
			if snub.state == acelerating || snub.state == braking || snub.state == cooldown {
				snub.changeStateWater()
				snub.changeStateWater()
			}
		}
	}
}

// Handle receiving of tests to be executed
func handleExperimentReceiving() {
	if key := getMqttKey(); key != "" {
		// Msg will must follow ExperimentData format
		client, _ := emitter.Connect(getMqttHost(), func(_ *emitter.Client, msg emitter.Message) {
			log.Printf("Sent message: '%s' topic: '%s'\n", msg.Payload(), msg.Topic())
		})

		var channel = getMqttChannelPrefix() + "/experiment"
		client.OnError(func(_ *emitter.Client, err emitter.Error) {
			mqttKeyStatusCh <- "Chave do MQTT: Sem permissão de leitura"
		})

		// Wait for tests
		client.Subscribe(key, channel, func(_ *emitter.Client, msg emitter.Message) {
			mqttHasReadingPermission = true
			if mqttHasWritingPermission {
				mqttKeyStatusCh <- "Chave do MQTT: Válida"
			} else {
				mqttKeyStatusCh <- "Chave do MQTT: Válida apenas para leitura"
			}

			runExperiment(string(msg.Payload()))
		})

		wgGeneral.Wait()
	} else {
		log.Println("MQTT key not set!!! Not waiting for tests to arrive...")
	}
}
