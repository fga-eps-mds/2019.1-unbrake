package main

import (
	"log"
)

func isCorrectDevice() bool {

	var out = true

	firmware := "Braketestbench"
	const lineEnd = 2

	buf := make([]byte, bufferSize)

	port.Flush()
	n := port.Write([]byte(" "))
	if n == -1 {
		log.Println("Error writing to serial")
		out = false
	}

	n, err := port.Read(buf)

	if err != nil {
		log.Println("Error reading from serial ", err)
		out = false
	} else if n == 0 {
		log.Println("Error reading from serial: timeout waiting for bytes")
		out = false
	}

	buf = buf[lineEnd:len(firmware)]

	if string(buf) != firmware[:len(buf)] {
		log.Println("Wrong serial port selected")
		out = false
	}

	return out
}
