package main

import (
	"log"
	"strconv"
	"sync"
	"time"
)

// Global snub which represents state of running test
var snub = Snub{state: acelerating}

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

// Snub is a cycle of aceleration, braking and cooldown,
// multiple snubs compose a test
type Snub struct {
	state     string
	isWaterOn bool
	mux       sync.Mutex
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

// SetState will set the state for the Snub, handling mutual exclusion
func (snub *Snub) SetState(state string) {
	snub.mux.Lock()
	defer snub.mux.Unlock()

	snub.state = currentToNextState[snub.state]

	if _, err := port.Write([]byte(snub.state)); err != nil {
		log.Println("Wasn't possible to write the state: ", err)
	}
}

func (snub *Snub) changeState() {
	oldState := snub.state
	snub.SetState(snub.state)

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
