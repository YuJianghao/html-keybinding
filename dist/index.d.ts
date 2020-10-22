export interface IKeyBindingItem {
    key: number | ((e: KeyboardEvent) => boolean);
    exec: (e: KeyboardEvent) => void;
}
export declare class KeyBindingListener {
    private elememt;
    private map;
    private _handler;
    constructor(elememt: HTMLElement);
    get empty(): boolean;
    register(id: string, kbi: IKeyBindingItem): void;
    unregister(id: string): void;
    dispose(): void;
}
export declare class KeyBinding {
    private listeners;
    private _root;
    constructor(debug?: boolean);
    mount(element: HTMLElement | null | undefined): void;
    register(element: HTMLElement | null | undefined, id: string, key: number | ((e: KeyboardEvent) => boolean), exec: (e: KeyboardEvent) => void): void;
    register(id: string, key: number | ((e: KeyboardEvent) => boolean), exec: (e: KeyboardEvent) => void): void;
    unregister(element: HTMLElement | null | undefined, id: string): void;
    unregister(id: string): void;
    dispose(): void;
    _addListener(element: HTMLElement): KeyBindingListener;
    _removeListener(element: HTMLElement): void;
}
