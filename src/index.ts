import { StandardKeyboardEvent } from "./lib/keyboardEvent";
import Stack from "./lib/stack";

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

/**
 * Item used to describe keybindings
 * @param key KeyMod and KeyCode
 * @param exec callback
 */
export interface IKeyBindingItem {
  id: string;
  key: number;
  exec: (e: KeyboardEvent) => void;
}

export class KeyBinding {
  static map: Map<string, KeyBinding> = new Map();
  private static _debug = false;
  private static _logger = new Logger(KeyBinding._debug);
  private _keybindings: Map<string, IKeyBindingItem> = new Map();
  private _stackMap: Map<string, Stack<IKeyBindingItem>> = new Map();
  /**
   * Handler used to handle keyboard event
   */
  public handler: (e: KeyboardEvent) => Promise<void>;
  private _logger: Logger = new Logger(this.debug || KeyBinding._debug);
  private _disposed = false;

  /**
   * Create a KeyBinding instance
   * @param name instance uniq name
   * @param debug true for debug mode
   */
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
    if (this._disposed) {
      this._logger.warn(`KeyBinding(${this.name}) has been disposed!`);
      return;
    }
    this._logger.log(`Keydown detected at ${this.name}`);
    const se = new StandardKeyboardEvent(e);
    this._keybindings.forEach((keybinding, key) => {
      if (se.equals(keybinding.key)) {
        this._logger.log(`Fire keybinding ${this.name}:${key}`);
        keybinding.exec(e);
      }
    });
  }

  private _override(id: string, keybinding: IKeyBindingItem) {
    if (!this._stackMap.has(id))
      this._stackMap.set(id, new Stack<IKeyBindingItem>());
    const kbi = this._keybindings.get(id);
    this._stackMap.get(id).push(kbi);
    this._keybindings.delete(id);
    this._logger.log(
      `Override ${this.name}:${id}:${kbi.key} with ${this.name}:${keybinding.id}:${keybinding.key}`
    );
  }

  private _resume(id: string) {
    const stack = this._stackMap.get(id);
    const kbi = stack.pop();
    this._keybindings.set(id, kbi);
    if (stack.isEmpty) this._stackMap.delete(id);
    this._logger.log(`Resumed ${this.name}:${id}:${kbi.key}`);
  }

  /**
   * Register a keybinding
   * @param id uniq id for keybinding
   * @param key keys e.g. KeyMod.CtrlCmd | KeyCode.Key_S
   * @param exec callback
   */
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
      this._override(id, { id, key, exec });
    }
    this._keybindings.set(id, { id, key, exec });
    this._logger.log(`Registed ${this.name}:${id}:${key}`);
  }

  /**
   * Unregister a keybinding
   * @param id uniq id for keybinding
   */
  public unregister(id: string): void {
    if (!this._keybindings.has(id)) {
      this._logger.warn(
        `KeyBindingItem id(${id}) not found in KeyBinding(${this.name})`
      );
      return;
    }
    this._keybindings.delete(id);
    if (this._stackMap.has(id)) {
      this._resume(id);
    }
    this._logger.log(`Unregisted ${this.name}:${id}`);
  }

  /**
   * Unregister all keybinding and remove instance from record.
   * After dispose, hanlder will not work any more.
   */
  public dispose(): void {
    this._keybindings.clear();
    KeyBinding.map.delete(this.name);
    this._disposed = true;
    this._logger.log(`Dispose KeyBinding: ${this.name}`);
  }

  /**
   * Enable debug mode
   */
  public static debug(): void {
    KeyBinding._debug = true;
    KeyBinding._logger.debug(true);
  }

  /**
   * Unregister all keybinding and remove all instance from record
   */
  public static dispose(): void {
    KeyBinding.map.forEach((keybinding) => keybinding.dispose());
    KeyBinding.map.clear();
  }
}
