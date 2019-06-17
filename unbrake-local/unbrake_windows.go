package main

import (
	"log"
	"os"
	"path"

	"golang.org/x/sys/windows/registry"
)

var aplicationFolderPath = path.Join(os.Getenv("APPDATA"), applicationFolderName)

func getLogPath() string {
	return path.Join(aplicationFolderPath, "logs")
}

func getSerialPorts() []string {
	// Reference: http://a46554.blogspot.com/2018/05/go-lang-list-all-com-port-in-windows.html

	var ports []string

	key, err := registry.OpenKey(registry.LOCAL_MACHINE, `HARDWARE\\DEVICEMAP\\SERIALCOMM`, registry.QUERY_VALUE)
	if err != nil {
		log.Fatal(err)
	}
	defer key.Close()

	// Get the key info
	keyInfo, err := key.Stat()

	if err != nil {
		log.Fatal(err)
	}

	// Get the value count
	valuesNames, err := key.ReadValueNames(int(keyInfo.ValueCount))
	if err != nil {
		log.Fatal(err)
	}

	// List all the string value
	for _, valueName := range valuesNames {
		portName, _, err := key.GetStringValue(valueName)
		if err != nil {
			log.Fatal(err)
		}
		ports = append(ports, portName)
	}

	return ports
}
