package main

import (
	"github.com/tarm/serial"
	"log"
	"sync"
	"time"
)

// Port represents the serial inteface with the connected device
type Port struct {
	port     *serial.Port
	readMux  sync.Mutex
	writeMux sync.Mutex
}

// Write in the serial port
func (port *Port) Write(data []byte) int {
	var n int
	var err error

	port.writeMux.Lock()
	defer port.writeMux.Unlock()

	if port.port != nil {
		n, err = port.port.Write(data)
		if err != nil {
			log.Printf("Could not to write on port: %v", err)
			n = -1
		}
	} else {
		log.Println("Was tried to write in a nil port")
		n = -1
	}
	return n
}

// Read from the serial port
func (port *Port) Read(data []byte) (int, error) {

	port.readMux.Lock()
	defer port.readMux.Unlock()

	var err error
	var n int

	if port.port != nil {
		n, err = port.port.Read(data)
		if err != nil {
			log.Printf("Was not possible to read from serial port: %v", err)
		}
	} else {
		log.Println("Was tried te read from a nil port")
	}

	return n, err

}

// Open a new serial port
func (port *Port) Open(portName string) error {

	port.readMux.Lock()
	port.writeMux.Lock()
	defer port.readMux.Unlock()
	defer port.writeMux.Unlock()

	var err error

	configuration := &serial.Config{
		Name:        portName,
		Baud:        baudRate,
		ReadTimeout: time.Second,
	}

	port.port, err = serial.OpenPort(configuration)

	if err != nil {
		log.Printf("Was not possible to open the serial port: %v", err)
	}

	return err
}

// IsOpen return true if the port is open
func (port *Port) IsOpen() bool {
	return port.port != nil
}

// Flush to clean the buffer
func (port *Port) Flush() {
	port.port.Flush()
}

// Close the serial port
func (port *Port) Close() {
	port.port.Close()
}
