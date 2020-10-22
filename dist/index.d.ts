declare class Logger {
    private _debug;
    constructor(_debug?: boolean);
    log(...args: any): void;
    warn(...args: any): void;
    error(...args: any): void;
    debug(debug?: boolean): void;
}
export interface IKeyBindingItem {
    key: number;
    exec: (e: KeyboardEvent) => void;
}
export declare class KeyBinding {
    name: string;
    debug: boolean;
    static map: Map<string, KeyBinding>;
    static __debug: boolean;
    static _logger: Logger;
    private _keybindings;
    handler: (e: KeyboardEvent) => Promise<void>;
    private _logger;
    constructor(name: string, debug?: boolean);
    private _handler;
    register(id: string, key: number, exec: (e: KeyboardEvent) => void): void;
    unregister(id: string): void;
    dispose(): void;
    static debug(debug?: boolean): void;
    static dispose(): void;
}
export {};
