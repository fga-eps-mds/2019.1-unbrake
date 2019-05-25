package main

import (
	"fmt"
	"github.com/tarm/serial"
	"log"
	"os"
	"strings"
	"time"
)

const (
	BUFFER_SIZE        = 48
	SIMULATOR_PORT_ENV = "SIMULATOR_PORT"
	BAUD_RATE          = 115200
	FREQUENCY_READING  = 10
)

func main() {
	c := &serial.Config{
		Name: os.Getenv(SIMULATOR_PORT_ENV),
		Baud: BAUD_RATE,
	}

	s, err := serial.OpenPort(c)

	if err != nil {
		log.Fatal(err)
	}

	const reading_delay = time.Second / FREQUENCY_READING
	fmt.Printf("Reading delay = %v\n", reading_delay)
	fmt.Println("\nReadings:")

	s.Flush()
	for true {
		_, err := s.Write([]byte("\""))
		if err != nil {
			log.Fatal(err)
		}

		buf := make([]byte, BUFFER_SIZE)
		_, err = s.Read(buf)
		if err != nil {
			log.Fatal(err)
		}

		//fmt.Printf("\t%d km/h\n", buf[0]) // For reading one byte
		fmt.Printf("\t%s\n", strings.TrimSpace(string(buf))) // For reading one byte
		//log.Printf("%v", strings.TrimSpace(string(buf[:n])))

		time.Sleep(reading_delay)
	}

	err = s.Close()

	if err != nil {
		log.Fatal(err)
	}
}
