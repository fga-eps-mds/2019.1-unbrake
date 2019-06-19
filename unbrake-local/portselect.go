package main

import (
	"github.com/getlantern/systray"
)

const checkedPrefix = "\u2713 "

// Represents the systray menu item of a serial port
// to be used
type serialPortGUI struct {
	item  *systray.MenuItem
	title string
}

// Controls the serial ports selection via GUI
func handlePortsSectionGUI() {
	systray.AddSeparator()
	portsTitle := systray.AddMenuItem("Portas", "Selecione a porta de leitura")
	portsTitle.Disable()

	// Get available ports
	portsNames := getSerialPorts()

	// Add environment variable serial port if not already exists
	found, userDefinedPort := false, getSerialPort()
	for i := range portsNames {
		if portsNames[i] == userDefinedPort {
			found = true
			break
		}
	}
	if !found && userDefinedPort != "" {
		portsNames = append(portsNames, userDefinedPort)
	}

	// Create ports
	ports := make([]serialPortGUI, len(portsNames))
	for i, portName := range portsNames {
		ports[i] = createPort(portName, "Select port")
	}

	systray.AddSeparator()

	handleSelect := func(selected int, ports []serialPortGUI) {
		for i := range ports {
			if i != selected {
				ports[i].uncheck()
			}
		}

		ports[selected].uncheck()
		serialPortNameCh <- ports[selected].title
		ports[selected].check()
	}

	go func() {
		for {
			port = <-serialPortCh
		}
	}()

	// Handle serial ports checking/unchecking
	for i, port := range ports {
		go func(selected int, portLocal serialPortGUI) {
			for {
				<-portLocal.item.ClickedCh
				handleSelect(selected, ports)
			}
		}(i, port)
	}
}

// Creates a Serial on systray
func createPort(title, tooltip string) serialPortGUI {
	var port serialPortGUI

	port.title = title
	port.item = systray.AddMenuItem(title, tooltip)

	return port
}

// Set the title of a serial on GUI
func (port *serialPortGUI) setTitle(title string) {
	port.title = title
	port.item.SetTitle(title)
}

// Check port menu item based on current state
func (port *serialPortGUI) check() {
	if !port.item.Checked() {
		port.setTitle(checkedPrefix + port.title)
		port.item.Check()
	}
}

// Uncheck port menu item based on current state
func (port *serialPortGUI) uncheck() {
	if port.item.Checked() {
		port.setTitle(port.title[len(checkedPrefix):])

		port.item.Uncheck()
	}
}
