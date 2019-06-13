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
	const portsFolder = "/dev"

	files, _ := ioutil.ReadDir(portsFolder)

	for _, file := range files {
		if strings.HasPrefix(file.Name(), "ttyACM") {
			ports = append(ports, path.Join(portsFolder, file.Name()))
		}
	}

	return ports
}
