# keybinding.js

A simple keybinding system for html

> Notes for early versions:
> API may change daily!!

## Installation

```bash
yarn add @winwin/keybinding.js
# npm install @winwin/keybinding.js # or npm
```

## Usage

### Basic

```js
import { KeyBinding } from "@winwin/keybinding.js";
const kbd = new KeyBinding();

// mount kbd to an HTMLElemnet
kbd.mount(document.body);

// register keybind
kbd.register("mykeybindingname", "KeyS", (e) => {
  // e.code = "KeyS"
  console.log("keydown event with params:", e);
});

// unregister keybind
kbd.unregister("mykeybindingname");

// dispost all keybindings
kbd.dispose();
```

### Custom key function and HTMLElement

```js
// fetch HTMLElement
const element = document.getElementById("myelement");
// register keybind
function key(e) {
  // `callback` will be fired if `key` return true
  return e.code === "KeyS";
}
function callback(e) {
  console.log("keydown event with params:", e);
}
kbd.register(element, "mykeybindingname", key, callback);
```

### With vue3 and typescript

> It should work with js, not tested.

You need to implement the vue plugin as follow.

```ts
// ./utils/vue-keybinding.ts
import { App } from "vue";
import { KeyBinding } from "keybinding.js";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $kbd: KeyBinding;
  }
}

export function createKeyBinding(debug = false) {
  const instance = new KeyBinding(debug);
  function install(app: App) {
    Object.defineProperty(app.config.globalProperties, "$kbd", {
      get: () => instance,
    });

    const unmountApp = app.unmount;
    app.unmount = function(...args: any) {
      instance.dispose();
      unmountApp.call(this, args);
    };
  }
  return {
    instance,
    install,
  };
}
```

Then use the plugin

```ts
// ./utils/mykeybinding.ts
import { createKeyBinding } from "./vue-keybinding";
const obj = createKeyBinding(process.env.NODE_ENV !== "production");
export const kbd = obj.instance;
export default obj;

// ./main.ts
// ...
import keybinding from "./utils/keybinding";
// ...
app.use(keybinding)
// ...

// ./App.vue
// ...
import { kbd } from "./utils/keybinding";
// ...
export default defineComponent({
  // Use composition API
  setup() {
    onMounted(async () => {
      kbd.mount(document.getElementById("app"));
      // then rigister keybindings any where
    });
    onBeforeUnmount(() => {
      // unrigister all keybindings
      kbd.dispose()
    });
  },
  // or use Parameters api
  mounted(){
    this.$kbd.mount(document.getElementById("app"));
    // then rigister keybindings any where
  }
  beforeUnmout(){
    // unrigister all keybindings
    this.$kbd.dispose()
  }
});
```

## Doc

### mount

```ts
mount(element: HTMLElement | null | undefined): void;
```

- Describe: mount keybinding.js to a root HTMLElement

### register

```ts
register(element: HTMLElement | null | undefined, id: string, key: string | ((e: KeyboardEvent) => boolean), exec: (e: KeyboardEvent) => void): void;
register(id: string, key: string | ((e: KeyboardEvent) => boolean), exec: (e: KeyboardEvent) => void): void;
```

- Describe: register keybinding
- Parameters:
  - **element** : HTMLElement which emit keydown event, default root HTMLElement when mount
  - **id** : keybinding id
  - **key** : Key code or a function, if function return ture, then run exec
  - **exec** : keybinding callback

### unregister

```ts
unregister(element: HTMLElement | null | undefined, id: string): void;
unregister(id: string): void;
```

- Describe: unregister keybinding
- Parameters:
  - **element** : HTMLElement which emit keydown event, default root HTMLElement when mount
  - **id** : keybinding id

### dispose

unregister all keybinding

```ts
dispose(): void;
```key: string | ((e: KeyboardEvent) => boolean), exec: (e: KeyboardEvent) => void): void;
```

- Describe: unregister all keybinding
