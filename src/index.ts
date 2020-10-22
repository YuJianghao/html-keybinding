import { StandardKeyboardEvent } from "./lib/keyboardEvent";

let _debug = false;

const logger = {
  log(...args: any) {
    if (!_debug) return;
    console.log(
      "%c[keybinding:debug]",
      "font-weight: bold;color:#1e90ff",
      ...args
    );
  },
  warn(...args: any) {
    console.warn("%c[keybinding]", "font-weight: bold;color:#f39c12", ...args);
  },
  error(...args: any) {
    console.error("%c[keybinding]", "font-weight: bold;color:#c0392b", ...args);
  },
};

export interface IKeyBindingItem {
  key: number | ((e: KeyboardEvent) => boolean);
  exec: (e: KeyboardEvent) => void;
}
export class KeyBindingListener {
  private map: Map<string, IKeyBindingItem>;
  private _handler: (e: KeyboardEvent) => void;
  constructor(private elememt: HTMLElement) {
    this.map = new Map();
    if (this.elememt.tabIndex < 0) this.elememt.tabIndex = 0;
    this._handler = (e: KeyboardEvent) => {
      const se = new StandardKeyboardEvent(e);
      this.map.forEach((item, id) => {
        if (typeof item.key === "function" && !item.key(e)) return;
        else if (typeof item.key === "number" && !se.equals(item.key)) return;
        logger.log(id, "called");
        item.exec(e);
      });
    };
    this.elememt.addEventListener("keydown", this._handler);
  }

  get empty(): boolean {
    return this.map.size < 1;
  }

  register(id: string, kbi: IKeyBindingItem): void {
    if (this.map.has(id)) logger.warn("Override callback", id);
    this.map.set(id, kbi);
  }

  unregister(id: string): void {
    if (!this.map.has(id)) return;
    this.map.delete(id);
  }

  dispose(): void {
    this.elememt.removeEventListener("keydown", this._handler);
  }
}
export class KeyBinding {
  private listeners: Map<HTMLElement, KeyBindingListener>;
  private _root: HTMLElement | null | undefined;
  constructor(debug = false) {
    _debug = debug;
    this.listeners = new Map();
    this._root = undefined;
  }

  /**
   * mount kbd to a dom element as default element
   * @param element default element
   */
  mount(element: HTMLElement | null | undefined): void {
    if (!element) {
      logger.error(
        "Trying to mount to null! Did you fetch your HTMLElement correctly?"
      );
      return;
    }
    this._root = element;
  }

  /**
   * Register a keybinding to element
   * @param element dom element that should listen to
   * @param id keybinding id string, uniq
   * @param key KeyMod and KeyCode
   * @param exec callback function
   */
  register(
    element: HTMLElement | null | undefined,
    id: string,
    key: number | ((e: KeyboardEvent) => boolean),
    exec: (e: KeyboardEvent) => void
  ): void;

  /**
   * Register a keybinding to default root element
   * @param id keybinding id string, uniq
   * @param key KeyMod and KeyCode
   * @param exec callback function
   */
  register(
    id: string,
    key: number | ((e: KeyboardEvent) => boolean),
    exec: (e: KeyboardEvent) => void
  ): void;

  register(...args: any): void {
    let element: HTMLElement | null | undefined,
      id: string,
      key: number | ((e: KeyboardEvent) => boolean),
      exec: (e: KeyboardEvent) => void;
    function warnRoot() {
      logger.error(
        `null root element
Did you mount kbd plugin to HTML?

Inside some kind of App.vue file. Mount keybinding plugin to your 
#app element (or any other html element as your root)

// App.vue
mounted(){
  kbd.mount(document.getElementById("app"));
}
`
      );
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
    } else if (!args[0]) {
      element = this._root;
      if (!element) {
        warnRoot();
        return;
      }
      id = args[1];
      key = args[2];
      exec = args[3];
    } else {
      element = args[0];
      id = args[1];
      key = args[2];
      exec = args[3];
    }
    if (!element) {
      logger.warn(
        "Trying to add eventHandlers to null. Did you fetch your HTMLElement correctly?"
      );
      return;
    }
    const listener = this._addListener(element);
    listener?.register(id, { key, exec });
  }

  /**
   * Register a keybinding from element
   * @param element dom element that should unregister with
   * @param id keybinding id string, uniq
   */
  unregister(element: HTMLElement | null | undefined, id: string): void;

  /**
   * Unregister a keybinding from default root element
   * @param id keybinding id string, uniq
   */
  unregister(id: string): void;

  unregister(...args: any): void {
    let element: HTMLElement | null | undefined, id: string;
    if (typeof args[0] === "string") {
      element = this._root;
      id = args[0];
    } else if (!args[0]) {
      element = this._root;
      id = args[1];
    } else {
      element = args[0];
      id = args[1];
    }
    if (!element) return;
    const listener = this.listeners.get(element);
    if (!listener) return;
    listener.unregister(id);
    if (listener.empty) {
      listener.dispose();
      this.listeners.delete(element);
    }
  }

  /**
   * Unregister all keybindings and remove all event listeners
   */
  dispose(): void {
    this.listeners.forEach((listener) => listener.dispose());
  }

  _addListener(element: HTMLElement): KeyBindingListener {
    if (this.listeners.has(element)) return this.listeners.get(element);
    const listener = new KeyBindingListener(element);
    this.listeners.set(element, listener);
    return listener;
  }

  _removeListener(element: HTMLElement): void {
    this.listeners.get(element)?.dispose();
    this.listeners.delete(element);
  }
}
