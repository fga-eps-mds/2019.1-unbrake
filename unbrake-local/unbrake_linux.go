package main

import (
	"io/ioutil"
	"os"
	"path"
	"strings"
)

func getLogPath() string {
	return path.Join("/home", os.Getenv("USER"), applicationFolderName, "logs")
}

func getSerialPorts() []string {
	var ports []string

	files, _ := ioutil.ReadDir("/dev")

	for _, file := range files {
		if strings.HasPrefix(file.Name(), "ttyACM") {
			ports = append(ports, file.Name())
		}
	}

	return ports
}
