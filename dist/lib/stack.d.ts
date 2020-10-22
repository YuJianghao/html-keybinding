declare class Stack<T> {
    private _items;
    constructor(_items?: T[]);
    push(ele: T): void;
    pop(): T;
    peek(): T;
    isEmpty(): boolean;
    size(): number;
    toString(): string;
}
export default Stack;
