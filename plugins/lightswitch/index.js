const { Plugin } = require('powercord/entities');
const { getModule } = require("powercord/webpack");
const { contextBridge } = require("electron");

module.exports = class Lightswitch extends Plugin {
	startPlugin(){
		self = this;
		contextBridge.exposeInMainWorld('Lightswitch', {
			set: self.setMode,
			ping: () => { return 'pong!' }
		});
	}

	setMode(mode){
		mode = mode.match(/^light$/i) ? 'light' : 'dark';
		getModule(['updateRemoteSettings']).then(m => {
			m.updateRemoteSettings({theme: mode});
		});
	}

	pluginWillUnload(){
		contextBridge.exposeInMainWorld('Lightswitch', {});
	}
}
