"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyBinding = exports.KeyBindingListener = void 0;
let _debug = false;
const logger = {
    log(...args) {
        if (!_debug)
            return;
        console.log("%c[keybinding:debug]", "font-weight: bold;color:#1e90ff", ...args);
    },
    warn(...args) {
        console.warn("%c[keybinding]", "font-weight: bold;color:#f39c12", ...args);
    },
    error(...args) {
        console.error("%c[keybinding]", "font-weight: bold;color:#c0392b", ...args);
    },
};
class KeyBindingListener {
    constructor(elememt) {
        this.elememt = elememt;
        this.map = new Map();
        if (this.elememt.tabIndex < 0)
            this.elememt.tabIndex = 0;
        this._handler = (e) => {
            this.map.forEach((item, id) => {
                if (typeof item.key === "function" && !item.key(e))
                    return;
                else if (e.code !== item.key)
                    return;
                logger.log(id, "called");
                item.exec(e);
            });
        };
        this.elememt.addEventListener("keydown", this._handler);
    }
    get empty() {
        return this.map.size < 1;
    }
    register(id, kbi) {
        if (this.map.has(id))
            logger.warn("Override callback", id);
        this.map.set(id, kbi);
    }
    unregister(id) {
        if (!this.map.has(id))
            return;
        this.map.delete(id);
    }
    dispose() {
        this.elememt.removeEventListener("keydown", this._handler);
    }
}
exports.KeyBindingListener = KeyBindingListener;
class KeyBinding {
    constructor(debug = false) {
        _debug = debug;
        this.listeners = new Map();
        this._root = undefined;
    }
    mount(element) {
        if (!element) {
            logger.error("Trying to mount to null! Did you fetch your HTMLElement correctly?");
            return;
        }
        this._root = element;
    }
    register(...args) {
        let element, id, key, exec;
        function warnRoot() {
            logger.error(`null root element
Did you mount kbd plugin to HTML?

Inside some kind of App.vue file. Mount keybinding plugin to your 
#app element (or any other html element as your root)

// App.vue
mounted(){
  kbd.mount(document.getElementById("app"));
}
`);
        }
        if (typeof args[0] === "string") {
            element = this._root;
            if (!element) {
                warnRoot();
                return;
            }
            id = args[0];
            key = args[1];
            exec = args[2];
        }
        else if (!args[0]) {
            element = this._root;
            if (!element) {
                warnRoot();
                return;
            }
            id = args[1];
            key = args[2];
            exec = args[3];
        }
        else {
            element = args[0];
            id = args[1];
            key = args[2];
            exec = args[3];
        }
        if (!element) {
            logger.warn("Trying to add eventHandlers to null. Did you fetch your HTMLElement correctly?");
            return;
        }
        const listener = this._addListener(element);
        listener === null || listener === void 0 ? void 0 : listener.register(id, { key, exec });
    }
    unregister(...args) {
        let element, id;
        if (typeof args[0] === "string") {
            element = this._root;
            id = args[0];
        }
        else if (!args[0]) {
            element = this._root;
            id = args[1];
        }
        else {
            element = args[0];
            id = args[1];
        }
        if (!element)
            return;
        const listener = this.listeners.get(element);
        if (!listener)
            return;
        listener.unregister(id);
        if (listener.empty) {
            listener.dispose();
            this.listeners.delete(element);
        }
    }
    dispose() {
        this.listeners.forEach((listener) => listener.dispose());
    }
    _addListener(element) {
        if (this.listeners.has(element))
            return this.listeners.get(element);
        const listener = new KeyBindingListener(element);
        this.listeners.set(element, listener);
        return listener;
    }
    _removeListener(element) {
        var _a;
        (_a = this.listeners.get(element)) === null || _a === void 0 ? void 0 : _a.dispose();
        this.listeners.delete(element);
    }
}
exports.KeyBinding = KeyBinding;
