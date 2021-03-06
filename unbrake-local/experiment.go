package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/getlantern/systray"
	emitter "github.com/icaropires/go/v2"
)

// Status flags
var (
	mqttHasWritingPermission = true
	mqttHasReadingPermission = true
)

// Experiment is composed of a collection of Snubs, it will perform
// N Snubs based based on the given data
type Experiment struct {
	mux                               sync.Mutex
	waterMux                          sync.Mutex
	snub                              Snub
	snubDuration                      time.Time
	duration                          time.Time
	distance                          float64
	id                                int
	continueRunning                   bool
	timeSleepWater                    float64
	temperatureLimit                  float64
	totalOfSnubs                      int
	firstConversionFactorTemperature  float64
	secondConversionFactorTemperature float64
	firstOffsetTemperature            float64
	secondOffsetTemperature           float64
	tireRadius                        float64
	sheaveMoveDiameter                int
	sheaveMotorDiameter               int
	maxSpeed                          float64
	doEnableWater                     bool
}

var isAvailable = true

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

	isAvailable = false
	quitExperimentEnableCh <- false
	systray.SetIcon(Icon)
	aplicationStatusCh <- "Colentando dados e executando ensaio"
	experiment.distance = 0

	if experiment.validateExperiment() {

		publishData("true: "+strconv.Itoa(experiment.id), "/validExperiment")

		experiment.snub.SetState(acelerating)
		experiment.duration = time.Now()
		experiment.snubDuration = time.Now()
		experiment.continueRunning = true
		go experiment.watchSnubState()
		experiment.snub.counterCh = make(chan int)
		experiment.snub.counterCh <- 1

	} else {

		publishData("false: "+strconv.Itoa(experiment.id), "/validExperiment")

	}

}

func (experiment *Experiment) validateExperiment() bool {

	var valid = true
	motorMaxRpm := 1700.0

	experiment.maxSpeed = float64(experiment.sheaveMoveDiameter/experiment.sheaveMotorDiameter) * motorMaxRpm

	if experiment.snub.upperSpeedLimit <= experiment.snub.lowerSpeedLimit {
		valid = false
	}

	if experiment.snub.upperSpeedLimit > experiment.maxSpeed {
		valid = false
	}

	if experiment.totalOfSnubs <= 0 || experiment.timeSleepWater <= 0 || experiment.temperatureLimit <= 0 {
		valid = false
	}

	if experiment.sheaveMoveDiameter <= 0 || experiment.sheaveMotorDiameter <= 0 {
		valid = false
	}

	if experiment.snub.delayAcelerateToBrake < 0 || experiment.snub.delayBrakeToCooldown < 0 || experiment.snub.timeCooldown < 0 {
		valid = false
	}

	if experiment.snub.lowerSpeedLimit < 0 {
		valid = false
	}

	return valid

}

// HandleExperimentsReceiving will wait for experiments to be published at a specific MQTT channel
// currently the prefix + /experiment
func HandleExperimentsReceiving() {
	for {
		wgHandleExperimentReceiving.Add(1)

		key := getMqttKey()
		if key == "" {
			log.Println("MQTT key not set!!! Not waiting for tests to arrive...")
			return
		}

		// Wait for tests
		var channel = getMqttChannelPrefix() + "/experiment"
		clientReading.Subscribe(key, channel, func(_ *emitter.Client, msg emitter.Message) {
			experiment := ExperimentFromJSON(msg.Payload())
			if isAvailable {

				log.Printf("Experiment received: %s", experiment)

				if port.IsOpen() {
					experiment.Run()
				} else {
					log.Println("Tried to begin an experiment without select a serial port")
				}

			} else {
				log.Printf("Alredy running an experiment but one was submitted(id: %v)", experiment.id)
			}
		})
		wgHandleExperimentReceiving.Wait()
	}
}

// ExperimentFromJSON takes a json as an array of bytes and returns an experiment
func ExperimentFromJSON(data []byte) *Experiment {
	var experiment Experiment

	var decoded experimentData
	if err := json.Unmarshal(data, &decoded); err != nil {
		log.Println("Wasn't possible to decode JSON, error: ", err)
	}

	experiment.id = decoded.Pk
	experiment.totalOfSnubs = decoded.Fields.Configuration.Number
	experiment.timeSleepWater = decoded.Fields.Configuration.Time
	experiment.doEnableWater = decoded.Fields.Configuration.EnableOutput
	experiment.firstConversionFactorTemperature = decoded.Fields.Calibration.Temperature[0].ConversionFactor
	experiment.secondConversionFactorTemperature = decoded.Fields.Calibration.Temperature[1].ConversionFactor
	experiment.firstOffsetTemperature = decoded.Fields.Calibration.Temperature[0].TemperatureOffset
	experiment.secondOffsetTemperature = decoded.Fields.Calibration.Temperature[1].TemperatureOffset
	experiment.temperatureLimit = decoded.Fields.Configuration.Temperature
	experiment.tireRadius = tireRadius(
		decoded.Fields.Calibration.Relations.TransversalSelectionWidth,
		decoded.Fields.Calibration.Relations.HeigthWidthRelation,
		decoded.Fields.Calibration.Relations.RimDiameter,
	)
	experiment.sheaveMoveDiameter = decoded.Fields.Calibration.Relations.SheaveMoveDiameter
	experiment.sheaveMotorDiameter = decoded.Fields.Calibration.Relations.SheaveMotorDiameter

	experiment.snub.delayAcelerateToBrake = decoded.Fields.Configuration.UpperTime
	experiment.snub.delayBrakeToCooldown = decoded.Fields.Configuration.LowerTime
	experiment.snub.upperSpeedLimit = float64(decoded.Fields.Configuration.UpperLimit)
	experiment.snub.lowerSpeedLimit = float64(decoded.Fields.Configuration.InferiorLimit)
	experiment.snub.timeCooldown = decoded.Fields.Configuration.TimeBetweenCycles

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

// Will manage the state of running experiment.snub, handling all state transitions,
// synchronization, collecting needed data and writing needed commands
func (experiment *Experiment) watchSnubState() {

	go experiment.watchEnd()
	go experiment.watchSpeed()
	go experiment.watchTemperature()
	go experiment.watchIsAvailable()
	go experiment.watchDuration()
	go experiment.watchDutyCycleAndDistance()
}

func (experiment *Experiment) watch(watchFunction func()) {

	for experiment.continueRunning {
		select {
		case <-quitExperimentCh:
			experiment.continueRunning = false
			aplicationStatusCh <- "Coletando dados"
		default:
			watchFunction()
		}
	}
	experiment.snub.SetState(cooldown)
}

func (experiment *Experiment) watchDutyCycleAndDistance() {

	experiment.watch(func() {

		frequency := <-dutyCycleAndDistanceCh
		speed := convertSpeed(frequency, experiment.tireRadius) // Frequency is the angular speed

		duty := experiment.speedToDutyCycle(speed)
		experiment.distance += travelledDistance(speed)

		writeDutyCycle(duty)
		publishData(strconv.FormatFloat(experiment.distance, 'f', 3, 64), "/distance")
		publishData(strconv.FormatFloat(duty, 'f', 3, 64), "/dutyCycle")

	})
}

func (experiment *Experiment) watchIsAvailable() {

	experiment.watch(func() {
		idRunningExperiment <- experiment.id
		time.Sleep(time.Millisecond * 500)
	})
}

func (experiment *Experiment) watchDuration() {
	experiment.watch(func() {
		end := time.Now()
		duration := end.Sub(experiment.duration)

		floatDuration := duration.Seconds()

		publishData(strconv.FormatFloat(floatDuration, 'f', 3, 64), "/experimentDuration")

		time.Sleep(time.Second * 1)
	})
}

func (experiment *Experiment) watchEnd() {

	experiment.watch(func() {

		time.Sleep(time.Millisecond)
		counter := <-experiment.snub.counterCh

		if counter > experiment.totalOfSnubs {
			experiment.snub.SetState(cooldown)
			close(experiment.snub.counterCh)

			log.Println("---> End of an experiment <---")
			experiment.continueRunning = false
			isAvailable = true
			quitExperimentEnableCh <- true
			wgHandleExperimentReceiving.Done()
			aplicationStatusCh <- "Coletando dados"
			systray.SetIcon(IconDisabled)

		} else {
			experiment.snub.counterCh <- counter
		}
	})
}

func (experiment *Experiment) speedToDutyCycle(speed float64) float64 {

	var duty = 0.0

	if speed/experiment.snub.upperSpeedLimit > 1 {
		duty = 100
	} else {
		duty = (speed / experiment.snub.upperSpeedLimit) * 100
	}

	return duty
}

// Watchs speed, changing state when necessary
func (experiment *Experiment) watchSpeed() {

	experiment.watch(func() {

		frequency := <-serialAttrs[frequencyIdx].handleCh

		speed := convertSpeed(frequency, experiment.tireRadius) // Frequency is the angular speed

		go func() {

			if (experiment.snub.state == acelerating || experiment.snub.state == aceleratingWater) && !experiment.snub.isStabilizing {
				if speed >= experiment.snub.upperSpeedLimit {
					experiment.snub.NextState() // Acelerating to Braking
				}
			} else if (experiment.snub.state == braking || experiment.snub.state == brakingWater) && !experiment.snub.isStabilizing {
				if speed < experiment.snub.lowerSpeedLimit {
					experiment.snub.NextState() // Braking to Cooldown
					if experiment.continueRunning {
						experiment.snub.NextState() // Cooldown to Acelerate

						end := time.Now()
						snubDuration := end.Sub(experiment.snubDuration)
						experiment.snubDuration = time.Now()

						floatSnubDuration := snubDuration.Seconds()

						publishData(strconv.FormatFloat(floatSnubDuration, 'f', 3, 64), "/snubDuration")

						log.Println("Duration of the snub: ", snubDuration)
					}
				}
			}
		}()
	})
}

// Follow temperature and throw water if needed
func (experiment *Experiment) watchTemperature() {
	experiment.watch(func() {

		temperature1 := <-serialAttrs[temperature1Idx].handleCh
		temperature2 := <-serialAttrs[temperature2Idx].handleCh

		temperature1 = convertTemperature(temperature1, experiment.firstConversionFactorTemperature, experiment.firstOffsetTemperature)
		temperature2 = convertTemperature(temperature2, experiment.secondConversionFactorTemperature, experiment.secondOffsetTemperature)

		if (temperature1 > experiment.temperatureLimit || temperature2 > experiment.temperatureLimit) && experiment.doEnableWater {
			if experiment.snub.state == acelerating || experiment.snub.state == braking || experiment.snub.state == cooldown {
				experiment.changeStateWater()
				if experiment.continueRunning {
					experiment.changeStateWater()
				}
			}
		}
	})
}

func (experiment *Experiment) changeStateWater() {

	experiment.waterMux.Lock()
	defer experiment.waterMux.Unlock()

	oldState := experiment.snub.state

	if !experiment.snub.isWaterOn {
		experiment.snub.state = offToOnWater[experiment.snub.state]
		log.Printf("Turn on water(%vs): %v ---> %v\n", experiment.timeSleepWater, byteToStateName[oldState], byteToStateName[experiment.snub.state])
	} else {
		time.Sleep(time.Second * time.Duration(experiment.timeSleepWater))
		experiment.snub.state = onToOffWater[experiment.snub.state]
		log.Printf("Turn off water: %v ---> %v\n", byteToStateName[oldState], byteToStateName[experiment.snub.state])
	}

	port.Write([]byte(experiment.snub.state))

	publishData(byteToStateName[experiment.snub.state], mqttSubchannelSnubState)
	experiment.snub.isWaterOn = !experiment.snub.isWaterOn
}
