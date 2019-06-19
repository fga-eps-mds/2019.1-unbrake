/*
Generates a self contained binary application which reads data from
a serial connection (was developed thinking on arduíno via USB)
and send it through network.

It is also able to send commands in ascii format. We are working
On a application which each ascii character represents a state
where some things are on and others off. In our case acelerator,
braking, etc.

We also provide a simple GUI through systray in which users can
interact with the application.
*/
package main

import (
	"log"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"time"

	"github.com/getlantern/systray"
)

// Channels general for controlling execution
var (
	wgGeneral            sync.WaitGroup
	stopCollectingDataCh chan bool
	sigsCh               chan os.Signal
)

var (
	aplicationStatusCh = make(chan string)
	mqttKeyStatusCh    = make(chan string)
)

func main() {
	logFile := getLogFile()
	defer logFile.Close()

	loadConfigFile()

	log.Println("--------------------------------------------")
	log.Println("Initializing application...")

	sigsCh = make(chan os.Signal, 1)
	signal.Notify(sigsCh, os.Interrupt)

	for i, subChannel := range mqttSubchannelSerialAttrs {
		serialAttrs[i].mqttSubchannel = subChannel
		serialAttrs[i].publishCh = make(chan string)
		serialAttrs[i].handleCh = make(chan float64)
	}

	go func() {
		isAvailable = true
		for {
			publishData(strconv.FormatBool(isAvailable), mqttSubchannelIsAvailable)
			time.Sleep(time.Millisecond * 500)
		}
	}()

	onExit := func() {
		snub.state = cooldown
		log.Println("Exiting...")
	}
	systray.Run(onReady, onExit)

	log.Println("Application finished!")
	log.Println("--------------------------------------------")
}

// Required by systray (GUI)
func onReady() {
	systray.SetIcon(Icon)
	systray.SetTitle("UnBrake")
	systray.SetTooltip("UnBrake")

	statusTitle := systray.AddMenuItem("Status", "Seção para visualização do status da aplicação")
	statusTitle.Disable()
	statusCollecting := systray.AddMenuItem("Status de arquisição", "Não iniciada")
	mqttKeyStatus := systray.AddMenuItem("Chave do MQTT: Não avaliada", "Status da chave do MQTT")

	go func() {
		for {
			select {
			case collectingStatusAux := <-aplicationStatusCh:
				statusCollecting.SetTitle(collectingStatusAux)
			case mqttKeyStatusChAux := <-mqttKeyStatusCh:
				mqttKeyStatus.SetTitle(mqttKeyStatusChAux)
			}
		}
	}()

	handlePortsSectionGUI()

	mQuitOrig := systray.AddMenuItem("Sair", "Fechar UnBrake")

	stopCollectingDataCh = make(chan bool, 1)

	// Wait for quitting
	go func() {
		select {
		case <-mQuitOrig.ClickedCh:
			log.Println("Quitting request by interface")
		case <-sigsCh:
			log.Println("Quitting request by signal")
		}

		stopCollectingDataCh <- true

		systray.Quit()
		log.Println("Finished systray")
	}()

	wgGeneral.Add(1)
	go collectData()
	go handleExperimentReceiving()

	if _, collectEnv := os.LookupEnv(mqttKeyEnv); collectEnv {
		go publishSerialAttrs()
	} else {
		log.Println("MQTT key not set!!! Data will not be published...")
	}

	wgGeneral.Wait()
}
