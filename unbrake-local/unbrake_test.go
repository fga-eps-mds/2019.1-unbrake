package main

import (
	"testing"
)

func TestUpdateStateWater(t *testing.T) {

	snub := Snub{state: aceleratingWater}
	snub.state = currentToNextState[snub.state]

	if snub.state != brakingWater {
		t.Errorf("Wrong state %v != %v", byteToStateName[snub.state], byteToStateName[brakingWater])
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != cooldownWater {
		t.Errorf("Wrong state %v != %v", byteToStateName[snub.state], byteToStateName[cooldownWater])
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != aceleratingWater {
		t.Errorf("Wrong state %v != %v", byteToStateName[snub.state], byteToStateName[aceleratingWater])
	}
}
