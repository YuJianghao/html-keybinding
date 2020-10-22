"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.KeyBinding=void 0;const keyboardEvent_1=require("./lib/keyboardEvent");class Logger{constructor(e=!1){this._debug=e}log(...e){this._debug&&console.log("%c[keybinding:debug]","font-weight: bold;color:#1e90ff",...e)}warn(...e){console.warn("%c[keybinding]","font-weight: bold;color:#f39c12",...e)}error(...e){console.error("%c[keybinding]","font-weight: bold;color:#c0392b",...e)}debug(e=!0){this._debug=e}}class KeyBinding{constructor(e,i=!1){this.name=e,this.debug=i,this._keybindings=new Map,this._logger=new Logger(this.debug||KeyBinding.__debug),this.name?KeyBinding.map.has(this.name)?this._logger.error("Duplicate name:",this.name):(KeyBinding.map.set(this.name,this),this.handler=async e=>{await this._handler(e)},this._logger.log("Create KeyBinding: "+this.name)):this._logger.error("name is required!")}async _handler(e){this._logger.log("Keydown detected at "+this.name);const i=new keyboardEvent_1.StandardKeyboardEvent(e);this._keybindings.forEach((n,g)=>{i.equals(n.key)&&(this._logger.log(`Fire keybinding ${this.name}:${g}`),n.exec(e))})}register(e,i,n){e?(this._keybindings.has(e)&&this._logger.warn(`Override ${this.name}:${e} with V-KeyCode=${i}`),this._keybindings.set(e,{key:i,exec:n}),this._logger.log(`Registed ${this.name}:${e} with V-KeyCode=${i}`)):this._logger.error("id is required!")}unregister(e){this._keybindings.has(e)?(this._keybindings.delete(e),this._logger.log(`Unregisted ${this.name}:${e}`)):this._logger.warn(`KeyBindingItem id(${e}) not found in KeyBinding(${this.name})`)}dispose(){this._keybindings.clear(),KeyBinding.map.delete(this.name),this._logger.log("Dispose KeyBinding: "+this.name)}static debug(e=!0){KeyBinding.__debug=e,KeyBinding._logger.debug(e)}static dispose(){KeyBinding.map.forEach(e=>e.dispose()),KeyBinding.map.clear()}}exports.KeyBinding=KeyBinding,KeyBinding.map=new Map,KeyBinding.__debug=!1,KeyBinding._logger=new Logger(KeyBinding.__debug);