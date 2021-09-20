const { Plugin } = require('powercord/entities');
const { getModule } = require("powercord/webpack");
const { contextBridge } = require("electron");

module.exports = class Lightswitch extends Plugin {
	startPlugin(){
		self = this;
		contextBridge.exposeInMainWorld('Lightswitch', {
			set: self.setMode.bind(self),
			toggle: self.toggle.bind(self),
			ping: () => { return 'pong!' }
		});
		powercord.api.commands.registerCommand({
			command: 'lightswitch',
			description: 'Flip the lights',
			usage: '{c} [mode]',
			executor: (args) => {
				if (args.length > 0){
					self.setMode(...args)
				} else {
					self.toggle()
				}
			}
		});
	}

	setMode(mode){
		mode = mode.match(/^light$/i) ? 'light' : 'dark';
		getModule(['updateRemoteSettings']).then(m => {
			m.updateRemoteSettings({theme: mode});
		});
	}

	toggle(){
		let currentMode = document
			.getElementsByTagName('html')[0]
			.className
			.split(' ')
			.find(c => /^theme-.*/.test(c))
			.split('-')[1];
		let desiredMode = currentMode == 'light' ? 'dark' : 'light';
		this.setMode(desiredMode);
	}

	pluginWillUnload(){
		contextBridge.exposeInMainWorld('Lightswitch', {});
	    powercord.api.commands.unregisterCommand('lightswitch');
	}
}
