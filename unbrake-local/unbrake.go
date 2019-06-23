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
	emitter "github.com/icaropires/go/v2"
)

// Channels general for controlling execution
var (
	wgQuit                      sync.WaitGroup
	wgGeneral                   sync.WaitGroup
	wgHandleExperimentReceiving sync.WaitGroup
	stopCollectingDataCh        chan bool
	sigsCh                      chan os.Signal
)

var (
	connectStatusCh        = make(chan string, 1)
	aplicationStatusCh     = make(chan string)
	mqttKeyStatusCh        = make(chan string)
	quitExperimentEnableCh = make(chan bool)
	quitExperimentCh       = make(chan bool)
	idRunningExperiment    = make(chan int)
	clientWriting          *emitter.Client
	clientReading          *emitter.Client
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

	clientWriting, _ = emitter.Connect(
		getMqttHost(),
		func(_ *emitter.Client, msg emitter.Message) {},
		emitter.WithConnectTimeout(time.Second*2),
		emitter.WithAutoReconnect(true),
		emitter.WithPingTimeout(time.Second*2),
	)

	clientReading, _ = emitter.Connect(
		getMqttHost(),
		func(_ *emitter.Client, msg emitter.Message) {},
		emitter.WithConnectTimeout(time.Second*2),
		emitter.WithAutoReconnect(true),
		emitter.WithPingTimeout(time.Second*2),
	)

	clientWriting.OnConnect(func(_ *emitter.Client) {
		wgHandleExperimentReceiving.Done()
		wgQuit.Done()
		connectStatusCh <- "Conectado"
		log.Println("Connected with writing broker successfully")
	})

	clientReading.OnConnect(func(_ *emitter.Client) {
		log.Println("Connected with reading broker successfully")
	})

	clientWriting.OnDisconnect(func(_ *emitter.Client, err error) {
		connectStatusCh <- "Desconectado"
		log.Println("Disconnected from writing from broker: ", err)
	})

	clientReading.OnDisconnect(func(_ *emitter.Client, err error) {
		connectStatusCh <- "Desconectado"
		log.Println("Disconnected from reading from broker: ", err)
	})

	if clientWriting.IsConnected() {
		connectStatusCh <- "Conectado"
	} else {
		connectStatusCh <- "Desconectado"
	}

	onExit := func() {
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
	mqttKeyStatus := systray.AddMenuItem("Chave de acesso: Não avaliada", "Status da chave do MQTT")

	connectStatus := systray.AddMenuItem("Deconectado", "Status de conecção")

	handlePortsSectionGUI()

	quitExperiment := systray.AddMenuItem("Encerrar ensaio", "Finaliza o ensaio atual")
	quitExperiment.Disable()

	mQuitOrig := systray.AddMenuItem("Sair", "Fechar UnBrake")

	go func() {
		for {
			select {
			case connectStatusAux := <-connectStatusCh:
				connectStatus.SetTitle(connectStatusAux)
			case aplicationStatusAux := <-aplicationStatusCh:
				statusCollecting.SetTitle(aplicationStatusAux)
			case mqttKeyStatusChAux := <-mqttKeyStatusCh:
				mqttKeyStatus.SetTitle(mqttKeyStatusChAux)
			case quitExperimentAux := <-quitExperimentEnableCh:
				if quitExperimentAux {
					quitExperiment.Disable()
				} else {
					quitExperiment.Enable()
				}
			case <-quitExperiment.ClickedCh:
				quitExperimentCh <- true
				quitExperiment.Disable()
				isAvailable = true
				log.Println("Experiment finished by user")
			}
		}
	}()

	go testKeys()

	go func() {
		for {
			wgQuit.Add(1)
			key := getMqttKey()

			channel := getMqttChannelPrefix() + "/quitExperiment"

			clientReading.Subscribe(key, channel, func(_ *emitter.Client, msg emitter.Message) {
				if !isAvailable {
					log.Println("Experiment finished by user")

					quitExperimentCh <- true
					quitExperiment.Disable()
					isAvailable = true
					wgQuit.Done()
					wgHandleExperimentReceiving.Done()
				}
			})

			wgQuit.Wait()
		}
	}()

	stopCollectingDataCh = make(chan bool, 1)

	// Wait for quitting
	go func() {
		select {
		case <-mQuitOrig.ClickedCh:
			log.Println("Quitting request by interface")
			port.Write([]byte(cooldown))
		case <-sigsCh:
			log.Println("Quitting request by signal")
			port.Write([]byte(cooldown))
		}

		stopCollectingDataCh <- true

		systray.Quit()
		log.Println("Finished systray")
	}()

	go func() {
		for {
			select {
			case idAux := <-idRunningExperiment:

				if !isAvailable {
					publishData("false: "+strconv.Itoa(idAux), mqttSubchannelIsAvailable)
				}
			default:

				if isAvailable {
					publishData("true", mqttSubchannelIsAvailable)
					time.Sleep(time.Millisecond * 500)
				}
			}
		}
	}()

	wgGeneral.Add(1)
	go CollectData()
	go HandleExperimentsReceiving()

	if getMqttKey() != "" {
		go publishSerialAttrs()
	} else {
		log.Println("MQTT key not set!!! Data will not be published...")
	}

	wgGeneral.Wait()
}
