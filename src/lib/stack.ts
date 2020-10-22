class Stack<T> {
  constructor(private _items: T[] = []) {}
  push(ele: T): void {
    this._items.push(ele);
  }
  pop(): T {
    return this._items.pop();
  }
  peek(): T {
    return this._items[this._items.length - 1];
  }
  isEmpty(): boolean {
    return this._items.length === 0;
  }
  size(): number {
    return this._items.length;
  }
  toString(): string {
    return this._items.map((item) => JSON.stringify(item)).join("\n");
  }
}
export default Stack;
