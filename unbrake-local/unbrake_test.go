package main

import (
	"testing"
)

func TestHandleAcelerate(t *testing.T) {

	snub := Snub{state: acelerate}
	snub.handleAcelerate()

	if snub.state != brake {
		t.Errorf("Wrong state %v != %v\n", snub.state, brake)
	}

	snub.state = acelerateWater
	snub.handleAcelerate()

	if snub.state != brakeWater {
		t.Errorf("Wrong state %v != %v\n", snub.state, brakeWater)
	}

}

func TestUpdateStateWater(t *testing.T) {

	snub := Snub{state: acelerateWater}
	snub.state = currentToNextState[snub.state]

	if snub.state != brakeWater {
		t.Errorf("Wrong state %v != %v", snub.state, brakeWater)
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != cooldownWater {
		t.Errorf("Wrong state %v != %v", snub.state, cooldownWater)
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != acelerateWater {
		t.Errorf("Wrong state %v != %v", snub.state, acelerateWater)
	}
}
