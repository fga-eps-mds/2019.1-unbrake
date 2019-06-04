package main

import (
	"testing"
)

func TestUpdateState(t *testing.T) {

	snub := Snub{state: Acelerate}
	snub.updateState()

	if snub.state != Brake {
		t.Errorf("Wrong state %v != %v", snub.state, Brake)
	}

	snub.updateState()

	if snub.state != CoolDown {
		t.Errorf("Wrong state %v != %v", snub.state, CoolDown)
	}

	snub.updateState()

	if snub.state != Acelerate {
		t.Errorf("Wrong state %v != %v", snub.state, Acelerate)
	}

}

func TestUpdateStateWater(t *testing.T) {

	snub := Snub{state: AcelerateWater}
	snub.updateState()

	if snub.state != BrakeWater {
		t.Errorf("Wrong state %v != %v", snub.state, BrakeWater)
	}

	snub.updateState()

	if snub.state != CoolDownWater {
		t.Errorf("Wrong state %v != %v", snub.state, CoolDownWater)
	}

	snub.updateState()

	if snub.state != AcelerateWater {
		t.Errorf("Wrong state %v != %v", snub.state, AcelerateWater)
	}
}
