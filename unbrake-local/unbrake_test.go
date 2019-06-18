package main

import (
	"testing"
)

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
