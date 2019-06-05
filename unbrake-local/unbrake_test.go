package main

import (
	"testing"
)

func TestUpdateState(t *testing.T) {

	snub := Snub{state: Acelerate}
	snub.state = currentToNextState[snub.state]

	if snub.state != Brake {
		t.Errorf("Wrong state %v != %v", snub.state, Brake)
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != CoolDown {
		t.Errorf("Wrong state %v != %v", snub.state, CoolDown)
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != Acelerate {
		t.Errorf("Wrong state %v != %v", snub.state, Acelerate)
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
