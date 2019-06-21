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
	counter               int
	state                 string
	delayAcelerateToBrake int
	upperSpeedLimit       float64
	lowerSpeedLimit       float64
	isWaterOn             bool
	isStabilizing         bool
	timeCooldown          int
	mux                   sync.Mutex
}

// NextState change state of snub to next corresponding in duty cycle
func (snub *Snub) NextState() {
	snub.mux.Lock()
	defer snub.mux.Unlock()

	switch snub.state {

	case acelerating, aceleratingWater: // Next is Braking
		snub.isStabilizing = true

		log.Println("Stabilizing...")
		time.Sleep(time.Second * time.Duration(snub.delayAcelerateToBrake))
		snub.changeState() // Acelerate ---> braking

		snub.isStabilizing = false

	case braking, brakingWater: // Next is Cooldown

		snub.changeState() // Brake ---> Cooldown
		time.Sleep(time.Second * time.Duration(snub.timeCooldown))

	case cooldown, cooldownWater: // Next is acelerate, end of a cycle
		snub.counter++
		publishData(strconv.Itoa(snub.counter), mqttSubchannelCurrentSnub)
		snub.changeState()

		log.Println("---> End of snub <---")

	default:
		log.Printf("Invalid state: %v", snub.state)
	}
}

// SetState will set the state for the Snub, handling mutual exclusion
func (snub *Snub) SetState(state string) {
	snub.mux.Lock()
	defer snub.mux.Unlock()

	snub.setStateNonExclusion(state)
}

func (snub *Snub) changeState() {
	oldState := snub.state
	snub.setStateNonExclusion(currentToNextState[snub.state])

	publishData(byteToStateName[snub.state], mqttSubchannelSnubState)
	log.Printf("Change state: %v ---> %v\n", byteToStateName[oldState], byteToStateName[snub.state])
}

func (snub *Snub) setStateNonExclusion(state string) {
	snub.state = state

	if _, err := port.Write([]byte(snub.state)); err != nil {
		log.Println("Wasn't possible to write the state: ", err)
	}
}
