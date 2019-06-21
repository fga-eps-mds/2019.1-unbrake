package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	emitter "github.com/emitter-io/go/v2"
)

// Status flags
var (
	mqttHasWritingPermission bool
	mqttHasReadingPermission bool
)

var wgExperiment sync.WaitGroup

// Experiment is composed of a collection of Snubs, it will perform
// N Snubs based based on the given data
type Experiment struct {
	mux                               sync.Mutex
	snub                              Snub
	timeSleepWater                    float64
	temperatureLimit                  float64
	totalOfSnubs                      int
	firstConversionFactorTemperature  float64
	secondConversionFactorTemperature float64
	firstOffsetTemperature            float64
	secondOffsetTemperature           float64
	doEnableWater                     bool
}

// IsAvailable if no experiments are running
var IsAvailable bool

// experimentData represents data needed for performing a experiment
type experimentData struct {
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

// Run an experiment
func (experiment *Experiment) Run() {
	wgExperiment.Add(1)

	IsAvailable = false
	experiment.snub.SetState(acelerating)
	go experiment.watchSnubState()
	experiment.snub.counterCh = make(chan int)
	experiment.snub.counterCh <- 1
	IsAvailable = true

	wgExperiment.Wait()
}

// HandleExperimentsReceiving will wait for experiments to be published at a specific MQTT channel
// currently the prefix + /experiment
func HandleExperimentsReceiving() {
	key := getMqttKey()
	if key == "" {
		log.Println("MQTT key not set!!! Not waiting for tests to arrive...")
		return
	}

	clientReading.OnError(func(_ *emitter.Client, err emitter.Error) {
		mqttKeyStatusCh <- "Chave do MQTT: Sem permissão de leitura"
	})

	// Wait for tests
	var channel = getMqttChannelPrefix() + "/experiment"
	clientReading.Subscribe(key, channel, func(_ *emitter.Client, msg emitter.Message) {
		mqttHasReadingPermission = true
		if mqttHasWritingPermission {
			mqttKeyStatusCh <- "Chave do MQTT: Válida"
		} else {
			mqttKeyStatusCh <- "Chave do MQTT: Válida apenas para leitura"
		}

		experiment := ExperimentFromJSON(msg.Payload())
		log.Printf("Experiment received: %s", experiment)
		experiment.Run()
	})

	wgGeneral.Wait()
}

// ExperimentFromJSON takes a json as an array of bytes and returns an experiment
func ExperimentFromJSON(data []byte) *Experiment {
	var experiment Experiment

	var decoded experimentData
	if err := json.Unmarshal(data, &decoded); err != nil {
		log.Println("Wasn't possible to decode JSON, error: ", err)
	}

	experiment.totalOfSnubs = 2 //decoded.Fields.Configuration.Number
	experiment.timeSleepWater = decoded.Fields.Configuration.Time
	experiment.doEnableWater = false //decoded.Fields.Configuration.EnableOutput
	experiment.firstConversionFactorTemperature = decoded.Fields.Calibration.Temperature[0].ConversionFactor
	experiment.secondConversionFactorTemperature = decoded.Fields.Calibration.Temperature[1].ConversionFactor
	experiment.firstOffsetTemperature = decoded.Fields.Calibration.Temperature[0].TemperatureOffset
	experiment.secondOffsetTemperature = decoded.Fields.Calibration.Temperature[1].TemperatureOffset
	experiment.temperatureLimit = 400 //decoded.Fields.Configuration.Temperature

	experiment.snub.delayAcelerateToBrake = decoded.Fields.Configuration.UpperTime
	experiment.snub.upperSpeedLimit = 150 //decoded.Fields.Configuration.UpperLimit
	experiment.snub.lowerSpeedLimit = 150 //decoded.Fields.Configuration.InferiorLimit
	experiment.snub.timeCooldown = decoded.Fields.Configuration.LowerTime

	return &experiment
}

func (experiment *Experiment) String() string {
	printedAttrs := []string{
		fmt.Sprintf("timeSleepWater: %v", experiment.timeSleepWater),
		fmt.Sprintf("totalOfSnubs: %v", experiment.totalOfSnubs),
		fmt.Sprintf("temperatureLimit: %v", experiment.temperatureLimit),
		fmt.Sprintf("firstConversionfactorTemperature: %v", experiment.firstConversionFactorTemperature),
		fmt.Sprintf("secondConversionfactorTemperature: %v", experiment.secondConversionFactorTemperature),
		fmt.Sprintf("firstOffsetTemperature: %v", experiment.firstOffsetTemperature),
		fmt.Sprintf("secondOffsetTemperature: %v", experiment.secondConversionFactorTemperature),
		fmt.Sprintf("doEnableWater: %v", experiment.doEnableWater),
	}

	return strings.Join(printedAttrs, ", ")
}

func (experiment *Experiment) watchEnd() {

	for {
		if counter := <-experiment.snub.counterCh; counter > experiment.totalOfSnubs {

			experiment.snub.SetState(cooldown)

			close(experiment.snub.counterCh)
			log.Println("---> End of an experiment <---")
			wgExperiment.Done()
			break
		} else {
			experiment.snub.counterCh <- counter
		}
	}
}

// Will manage the state of running experiment.snub, handling all state transitions,
// synchronization, collecting needed data and writing needed commands
func (experiment *Experiment) watchSnubState() {

	go experiment.watchSpeed()
	go experiment.watchTemperature()
	go experiment.watchEnd()
}

// Watchs speed, changing state when necessary
func (experiment *Experiment) watchSpeed() {
	for {
		speed := <-serialAttrs[speedIdx].handleCh

		if (experiment.snub.state == acelerating || experiment.snub.state == aceleratingWater) && !experiment.snub.isStabilizing {
			if speed >= experiment.snub.upperSpeedLimit {
				experiment.snub.NextState() // Acelerating to Braking
			}
		} else if experiment.snub.state == braking || experiment.snub.state == brakingWater {
			if speed < experiment.snub.lowerSpeedLimit {
				experiment.snub.NextState() // Braking to Cooldown
				experiment.snub.NextState() // Braking to
			}
		}
	}
}

// Follow temperature and throw water if needed
func (experiment *Experiment) watchTemperature() {
	for {
		temperature1 := convertTemperature(<-serialAttrs[temperature1Idx].handleCh, experiment.firstConversionFactorTemperature, experiment.firstOffsetTemperature)
		temperature2 := convertTemperature(<-serialAttrs[temperature2Idx].handleCh, experiment.secondConversionFactorTemperature, experiment.secondOffsetTemperature)

		if (temperature1 > experiment.temperatureLimit || temperature2 > experiment.temperatureLimit) && experiment.doEnableWater {
			if experiment.snub.state == acelerating || experiment.snub.state == braking || experiment.snub.state == cooldown {
				experiment.changeStateWater()
				experiment.changeStateWater()
			}
		}
	}
}

func (experiment *Experiment) changeStateWater() {
	oldState := experiment.snub.state

	experiment.snub.isWaterOn = !experiment.snub.isWaterOn

	if !experiment.snub.isWaterOn {
		experiment.snub.state = offToOnWater[experiment.snub.state]
		log.Printf("Turn on water(%vs): %v ---> %v\n", experiment.timeSleepWater, byteToStateName[oldState], byteToStateName[experiment.snub.state])
	} else {
		time.Sleep(time.Second * time.Duration(experiment.timeSleepWater))
		experiment.snub.state = onToOffWater[experiment.snub.state]
		log.Printf("Turn off water: %v ---> %v\n", byteToStateName[oldState], byteToStateName[experiment.snub.state])
	}

	if _, err := port.Write([]byte(experiment.snub.state)); err != nil {
		log.Println("Wasn't possible to write the state: ", err)
	}

	publishData(byteToStateName[experiment.snub.state], mqttSubchannelSnubState)
	log.Printf("Turn on water(%vs): %v ---> %v\n", experiment.timeSleepWater, byteToStateName[oldState], byteToStateName[experiment.snub.state])
}
