package main

import (
	"io/ioutil"
	"os"
	"path"
	"strings"
)

var aplicationFolderPath = path.Join("/home", os.Getenv("USER"), applicationFolderName)

func getLogPath() string {
	return path.Join(aplicationFolderPath, "logs")
}

func getSerialPorts() []string {
	var ports []string
	const portsFolder = "/dev"

	files, _ := ioutil.ReadDir(portsFolder)

	for _, file := range files {
		if strings.HasPrefix(file.Name(), "ttyACM") {
			ports = append(ports, path.Join(portsFolder, file.Name()))
		}
	}

	return ports
}
