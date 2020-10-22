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
export declare class KeyBinding {
    name: string;
    debug: boolean;
    static map: Map<string, KeyBinding>;
    private static _debug;
    private static _logger;
    private _keybindings;
    private _ids;
    private _stackMap;
    /**
     * Handler used to handle keyboard event
     */
    handler: (e: KeyboardEvent) => Promise<void>;
    private _logger;
    private _disposed;
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
     * Register a keybinding
     * @param id uniq id for keybinding
     * @param key keys e.g. KeyMod.CtrlCmd | KeyCode.Key_S
     * @param exec callback
     */
    register(id: string, key: number, exec: (e: KeyboardEvent) => void): void;
    /**
     * Unregister a keybinding
     * @param id uniq id for keybinding
     */
    unregister(id: string): void;
    /**
     * Unregister all keybinding and remove instance from record.
     * After dispose, hanlder will not work any more.
     */
    dispose(): void;
    /**
     * Enable debug mode
     */
    static debug(): void;
    /**
     * Unregister all keybinding and remove all instance from record
     */
    static dispose(): void;
}
