package main

import (
	"encoding/json"
	"log"
	"strconv"
	"sync"

	emitter "github.com/emitter-io/go/v2"
)

// Status flags
var (
	mqttHasWritingPermission bool
	mqttHasReadingPermission bool
)

// Flags with intermediary states
var (
	stabilizing = false
	enableWater bool
	isAvailable bool
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

var teste = make(chan bool, 1)

// RunExperiment is composed of a collection of Snubs, it will perform
// N Snubs based based on the given data
func RunExperiment(data ExperimentData) {
	teste <- true

	wgExperiment.Add(1)
	isAvailable = false

	watchSnubState()
	snub.SetState(cooldown)

	isAvailable = true
	wgExperiment.Wait()
	<-teste
}

// HandleExperimentsReceiving will wait for experiments to be published at a specific MQTT channel
// currently the prefix + /experiment
func HandleExperimentsReceiving() {
	key := getMqttKey()
	if key == "" {
		log.Println("MQTT key not set!!! Not waiting for tests to arrive...")
		return
	}

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

		experimentData := decodeExperimentData(msg.Payload())
		RunExperiment(experimentData)
	})

	wgGeneral.Wait()
}

func decodeExperimentData(data []byte) ExperimentData {
	var decoded ExperimentData

	if err := json.Unmarshal(data, &decoded); err != nil {
		log.Println("Wasn't possible to decode JSON, error: ", err)
	}

	totalOfSnubs = 2      //decoded.Fields.Configuration.Number
	upperSpeedLimit = 150 //decoded.Fields.Configuration.UpperLimit
	lowerSpeedLimit = 150 //decoded.Fields.Configuration.InferiorLimit
	timeSleepWater = decoded.Fields.Configuration.Time
	delayAcelerateToBrake = decoded.Fields.Configuration.UpperTime
	timeCooldown = decoded.Fields.Configuration.LowerTime
	temperatureLimit = 400 //decoded.Fields.Configuration.Temperature
	enableWater = false    //decoded.Fields.Configuration.EnableOutput
	firstConversionFactorTemperature = decoded.Fields.Calibration.Temperature[0].ConversionFactor
	secondConversionFactorTemperature = decoded.Fields.Calibration.Temperature[1].ConversionFactor
	firstOffsetTemperature = decoded.Fields.Calibration.Temperature[0].TemperatureOffset
	secondOffsetTemperature = decoded.Fields.Calibration.Temperature[1].TemperatureOffset

	log.Println("totalOfSnubs: ", totalOfSnubs)
	log.Println("upperSpeedLimit: ", upperSpeedLimit)
	log.Println("lowerSpeedLimit: ", lowerSpeedLimit)
	log.Println("timeSleepWater: ", timeSleepWater)
	log.Println("delayAcelerateToBrake: ", delayAcelerateToBrake)
	log.Println("timeCooldown: ", timeCooldown)
	log.Println("temperatureLimit: ", temperatureLimit)
	log.Println("conversionFactorTemperature: ", firstConversionFactorTemperature)
	log.Println("offsetTemperature: ", firstOffsetTemperature)

	return decoded
}

func handleExperimentEnd() {
	currentSnub = 1
	snub.state = cooldown

	publishData(strconv.Itoa(currentSnub), mqttSubchannelCurrentSnub)
	wgExperiment.Done()
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
