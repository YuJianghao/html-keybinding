import { StandardKeyboardEvent } from "./lib/keyboardEvent";

class Logger {
  constructor(private _debug = false) {}
  log(...args: any) {
    if (!this._debug) return;
    console.log(
      "%c[keybinding:debug]",
      "font-weight: bold;color:#1e90ff",
      ...args
    );
  }
  warn(...args: any) {
    console.warn("%c[keybinding]", "font-weight: bold;color:#f39c12", ...args);
  }
  error(...args: any) {
    console.error("%c[keybinding]", "font-weight: bold;color:#c0392b", ...args);
  }
  public debug(debug = true) {
    this._debug = debug;
  }
}

export interface IKeyBindingItem {
  key: number;
  exec: (e: KeyboardEvent) => void;
}

export class KeyBinding {
  static map: Map<string, KeyBinding> = new Map();
  static __debug = false;
  static _logger = new Logger(KeyBinding.__debug);
  private _keybindings: Map<string, IKeyBindingItem> = new Map();
  public handler: (e: KeyboardEvent) => Promise<void>;
  private _logger: Logger = new Logger(this.debug || KeyBinding.__debug);
  constructor(public name: string, public debug = false) {
    if (!this.name) {
      this._logger.error("name is required!");
      return;
    }
    if (KeyBinding.map.has(this.name)) {
      this._logger.error("Duplicate name:", this.name);
      return;
    }
    KeyBinding.map.set(this.name, this);
    this.handler = async (e) => {
      await this._handler(e);
    };
    this._logger.log(`Create KeyBinding: ${this.name}`);
  }

  private async _handler(e: KeyboardEvent): Promise<void> {
    this._logger.log(`Keydown detected at ${this.name}`);
    const se = new StandardKeyboardEvent(e);
    this._keybindings.forEach((keybinding, key) => {
      if (se.equals(keybinding.key)) {
        this._logger.log(`Fire keybinding ${this.name}:${key}`);
        keybinding.exec(e);
      }
    });
  }

  public register(
    id: string,
    key: number,
    exec: (e: KeyboardEvent) => void
  ): void {
    if (!id) {
      this._logger.error("id is required!");
      return;
    }
    if (this._keybindings.has(id)) {
      this._logger.warn(`Override ${this.name}:${id} with V-KeyCode=${key}`);
    }
    this._keybindings.set(id, { key, exec });
    this._logger.log(`Registed ${this.name}:${id} with V-KeyCode=${key}`);
  }

  public unregister(id: string): void {
    if (!this._keybindings.has(id)) {
      this._logger.warn(
        `KeyBindingItem id(${id}) not found in KeyBinding(${this.name})`
      );
      return;
    }
    this._keybindings.delete(id);
    this._logger.log(`Unregisted ${this.name}:${id}`);
  }

  public dispose(): void {
    this._keybindings.clear();
    KeyBinding.map.delete(this.name);
    this._logger.log(`Dispose KeyBinding: ${this.name}`);
  }

  public static debug(debug = true): void {
    KeyBinding.__debug = debug;
    KeyBinding._logger.debug(debug);
  }

  public static dispose(): void {
    KeyBinding.map.forEach((keybinding) => keybinding.dispose());
    KeyBinding.map.clear();
  }
}
