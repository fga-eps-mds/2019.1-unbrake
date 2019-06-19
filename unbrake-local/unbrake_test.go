package main

import (
	"testing"
)

func TestUpdateStateWater(t *testing.T) {

	snub := Snub{state: acelerating}
	snub.state = currentToNextState[snub.state]

	if snub.state != brakingWater {
		t.Errorf("Wrong state %v != %v", snub.state, brakingWater)
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != cooldownWater {
		t.Errorf("Wrong state %v != %v", snub.state, cooldownWater)
	}

	snub.state = currentToNextState[snub.state]

	if snub.state != aceleratingWater {
		t.Errorf("Wrong state %v != %v", snub.state, aceleratingWater)
	}
}
