export { KeyMod, KeyCode } from "./lib/keyCodes";
interface IKeyBindingOptions {
    stop?: boolean;
    prevent?: boolean;
}
export declare class KeyBinding {
    name: string;
    debug: boolean;
    private static _map;
    private static _debug;
    private _logger;
    private static _logger;
    private _keybindings;
    private _ids;
    private _stackMap;
    /**
     * Handler used to handle keyboard event
     */
    handler: (e: KeyboardEvent) => Promise<void>;
    private _disposed;
    private _stop;
    private _prevent;
    /**
     * Create a KeyBinding instance
     * @param name instance uniq name
     * @param debug true for debug mode
     */
    constructor(name: string, debug?: boolean);
    private _handler;
    private _halt;
    private _resume;
    /**
     * Enable debug mode
     */
    static debug(): void;
    /**
     * Create new instance with name, the same as `new KeyBinding(name)`
     * @param name uniq name for instance
     */
    static createInstance(name: string): KeyBinding;
    /**
     * Get an instance with name
     * @param name uniq name for instance
     */
    static getInstance(name: string): KeyBinding | null;
    /**
     * Register a keybinding
     * @param id uniq id for keybinding
     * @param key keys e.g. KeyMod.CtrlCmd | KeyCode.Key_S
     * @param exec callback
     */
    register(id: string, key: number, exec: (e: KeyboardEvent) => void, options?: IKeyBindingOptions): void;
    /**
     * Register a keybinding. Will create new instance if not exists.
     * @param name uniq name for instance
     * @param id uniq id for keybinding
     * @param key keys e.g. KeyMod.CtrlCmd | KeyCode.Key_S
     * @param exec callback
     */
    static register(name: string, id: string, key: number, exec: (e: KeyboardEvent) => void): void;
    /**
     * Unregister a keybinding
     * @param id uniq id for keybinding
     */
    unregister(id: string): void;
    /**
     * Unregister a keybinding
     * @param name uniq name for instance
     * @param id uniq id for keybinding
     */
    static unregister(name: string, id: string): void;
    /**
     * Add key(s) to stoped keys
     * e.stopPropagation() will run when event fired
     * @param key key to prevent
     */
    stop(key: number): void;
    stop(keys: number[]): void;
    /**
     * Add key(s) to stoped keys
     * e.stopPropagation() will run when event fired
     * @param name uniq name for instance
     * @param key key to prevent
     */
    static stop(name: string, key: number): void;
    static stop(name: string, keys: number[]): void;
    /**
     * Remove key(s) to stoped keys
     * e.stopPropagation() will run when event fired
     * @param key key to prevent
     */
    unstop(key: number): void;
    unstop(keys: number[]): void;
    /**
     * Remove key(s) to stoped keys
     * e.stopPropagation() will run when event fired
     * @param name uniq name for instance
     * @param key key to prevent
     */
    static unstop(name: string, key: number): void;
    static unstop(name: string, keys: number[]): void;
    /**
     * Add key(s) to prevented keys
     * e.preventDefault() will run when event fired
     * @param key key to prevent
     */
    prevent(key: number): void;
    prevent(keys: number[]): void;
    /**
     * Add key(s) to prevented keys
     * e.preventDefault() will run when event fired
     * @param name uniq name for instance
     * @param key key to prevent
     */
    static prevent(name: string, key: number): void;
    static prevent(name: string, keys: number[]): void;
    /**
     * Remove key(s) to prevented keys
     * e.preventDefault() will run when event fired
     * @param key key to prevent
     */
    unprevent(key: number): void;
    unprevent(keys: number[]): void;
    /**
     * Remove key(s) to prevented keys
     * e.preventDefault() will run when event fired
     * @param name uniq name for instance
     * @param key key to prevent
     */
    static unprevent(name: string, key: number): void;
    static unprevent(name: string, keys: number[]): void;
    /**
     * Unregister all keybinding and remove instance from record.
     * After dispose, hanlder will not work any more.
     */
    dispose(): void;
    /**
     * Unregister all keybinding and remove all instance from record
     */
    static dispose(): void;
}
