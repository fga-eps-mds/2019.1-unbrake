package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"path"
)

var (
	configFile ConfigFile
)

// Serial constants
const (
	bufferSize       = 48
	serialPortEnv    = "SERIAL_PORT"
	baudRate         = 115200
	frequencyReading = 5
	numSerialAttrs   = 11 // number of attributes read simultaneously from serial device

)

// MQTT constants
const (
	mqttHostEnv              = "MQTT_HOST"
	mqttDefaultHost          = "unbrake.ml"
	mqttDefaultPort          = "8080"
	mqttPortEnv              = "MQTT_PORT"
	mqttChannelPrefixDefault = "unbrake/galpao"
	mqttChannelPrefixEnv     = "MQTT_CHANNEL_PREFIX"
	mqttKeyEnv               = "MQTT_KEY"
)

// ConfigFile used to set global parameters
type ConfigFile struct {
	SerialPort        string
	MqttHost          string
	MqttPort          string
	MqttKey           string
	MqttChannelPrefix string
}

// General application constants
const (
	logFilePath           = "unbrake.log"
	applicationFolderName = "UnBrake"
	configFileName        = "config.json"
)

// Based on current OS will create application folder
// and log file (if not exists). Returns the log file
// as a File object
func getLogFile() *os.File {
	logPath := getLogPath()

	os.MkdirAll(logPath, os.ModePerm)
	logPath = path.Join(logPath, logFilePath)

	logFile, err := os.OpenFile(logPath, os.O_SYNC|os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds)
	log.SetOutput(logFile)

	return logFile
}

func loadConfigFile() {
	data, err := ioutil.ReadFile(path.Join(aplicationFolderPath, configFileName))
	if err != nil {
		log.Println("Not possible to read configuration file, default will be used, or from enviroment variables")
	}
	err = json.Unmarshal(data, &configFile)
	if err != nil {
		log.Printf("Invalid Config file: %v\n", err)
	}
}

func getMqttKey() string {
	key, doesExists := os.LookupEnv(mqttKeyEnv)
	if !doesExists {
		if configFile.MqttKey != "" {
			key = configFile.MqttKey
		} else {
			key = ""
		}
	}
	return key
}

func getMqttChannelPrefix() string {
	channelPrefix, doesExists := os.LookupEnv(mqttChannelPrefixEnv)
	if !doesExists {
		if configFile.MqttChannelPrefix != "" {
			channelPrefix = configFile.MqttChannelPrefix
		} else {
			channelPrefix = mqttChannelPrefixDefault
		}
	}
	return channelPrefix
}

func getSerialPort() string {
	port, doesExists := os.LookupEnv(serialPortEnv)
	if !doesExists {
		if configFile.SerialPort != "" {
			port = configFile.SerialPort
		} else {
			port = ""
		}
	}
	return port
}

// Get complete host name with port of the MQTT broker
func getMqttHost() string {
	host, doesExists := os.LookupEnv(mqttHostEnv)
	if !doesExists {
		if configFile.MqttHost != "" {
			host = configFile.MqttHost
		} else {
			host = mqttDefaultHost
		}
	}

	port, doesExists := os.LookupEnv(mqttPortEnv)
	if !doesExists {
		if configFile.MqttPort != "" {
			port = configFile.MqttPort
		} else {
			port = mqttDefaultPort
		}
	}

	return "tcp://" + host + ":" + port
}
