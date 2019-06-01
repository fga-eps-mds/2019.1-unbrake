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

func TestTurnOnWater(t *testing.T) {

	snub := Snub{state: Acelerate}
	snub.turnOnWater()

	if snub.state != AcelerateWater {
		t.Errorf("Wrong state %v != %v", snub.state, AcelerateWater)
	}

	snub.state = Brake
	snub.turnOnWater()

	if snub.state != BrakeWater {
		t.Errorf("Wrong state %v != %v", snub.state, BrakeWater)
	}

	snub.state = CoolDown
	snub.turnOnWater()

	if snub.state != CoolDownWater {
		t.Errorf("Wrong state %v != %v", snub.state, CoolDownWater)
	}

}

func TestTurnAlredyOnWater(t *testing.T) {

	snub := Snub{state: AcelerateWater}
	snub.turnOnWater()

	if snub.state != AcelerateWater {
		t.Errorf("Wrong state %v != %v", snub.state, AcelerateWater)
	}

	snub.state = BrakeWater
	snub.turnOnWater()

	if snub.state != BrakeWater {
		t.Errorf("Wrong state %v != %v", snub.state, BrakeWater)
	}

	snub.state = CoolDownWater
	snub.turnOnWater()

	if snub.state != CoolDownWater {
		t.Errorf("Wrong state %v != %v", snub.state, CoolDownWater)
	}

}

func TestTurnOffWater(t *testing.T) {

	snub := Snub{state: AcelerateWater}
	snub.turnOffWater()

	if snub.state != Acelerate {
		t.Errorf("Wrong state %v != %v", snub.state, Acelerate)
	}

	snub.state = BrakeWater
	snub.turnOffWater()

	if snub.state != Brake {
		t.Errorf("Wrong state %v != %v", snub.state, Brake)
	}

	snub.state = CoolDownWater
	snub.turnOffWater()

	if snub.state != CoolDown {
		t.Errorf("Wrong state %v != %v", snub.state, CoolDown)
	}

}

func TestTurnAlredyOffWater(t *testing.T) {

	snub := Snub{state: Acelerate}
	snub.turnOffWater()

	if snub.state != Acelerate {
		t.Errorf("Wrong state %v != %v", snub.state, Acelerate)
	}

	snub.state = Brake
	snub.turnOffWater()

	if snub.state != Brake {
		t.Errorf("Wrong state %v != %v", snub.state, Brake)
	}

	snub.state = CoolDown
	snub.turnOffWater()

	if snub.state != CoolDown {
		t.Errorf("Wrong state %v != %v", snub.state, CoolDown)
	}

}
