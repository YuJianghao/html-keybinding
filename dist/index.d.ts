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
    /**
     * mount kbd to a dom element as default element
     * @param element default element
     */
    mount(element: HTMLElement | null | undefined): void;
    /**
     * Register a keybinding to element
     * @param element dom element that should listen to
     * @param id keybinding id string, uniq
     * @param key KeyMod and KeyCode
     * @param exec callback function
     */
    register(element: HTMLElement | null | undefined, id: string, key: number | ((e: KeyboardEvent) => boolean), exec: (e: KeyboardEvent) => void): void;
    /**
     * Register a keybinding to default root element
     * @param id keybinding id string, uniq
     * @param key KeyMod and KeyCode
     * @param exec callback function
     */
    register(id: string, key: number | ((e: KeyboardEvent) => boolean), exec: (e: KeyboardEvent) => void): void;
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
    /**
     * Unregister all keybindings and remove all event listeners
     */
    dispose(): void;
    _addListener(element: HTMLElement): KeyBindingListener;
    _removeListener(element: HTMLElement): void;
}
