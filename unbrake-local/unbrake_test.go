package main

import (
	"testing"
)

func TestHandleAcelerate(t *testing.T) {

	snub := Snub{state: Acelerate}
	snub.handleAcelerate()

	if snub.state != Brake {
		t.Errorf("Wrong state %v != %v\n", snub.state, Brake)
	}

	snub.state = AcelerateWater
	snub.handleAcelerate()

	if snub.state != BrakeWater {
		t.Errorf("Wrong state %v != %v\n", snub.state, BrakeWater)
	}

}

func TestUpdateStateWater(t *testing.T) {

	snub := Snub{state: AcelerateWater}
	snub.state = currentToNextState[snub.state]

	if snub.state != BrakeWater {
		t.Errorf("Wrong state %v != %v", snub.state, BrakeWater)
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != CoolDownWater {
		t.Errorf("Wrong state %v != %v", snub.state, CoolDownWater)
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != AcelerateWater {
		t.Errorf("Wrong state %v != %v", snub.state, AcelerateWater)
	}
}
