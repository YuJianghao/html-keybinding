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

### Step.01 config keybinding.js

```js
import { KeyBinding } from "@winwin/keybinding.js";
import { KeyCode, KeyMod } from "@winwin/keybinding.js/dist/lib/keyCodes";

// Create keybinding instance
const kbd = new KeyBinding("myinstancename");

// Register keybind
kbd.register("mykeybindingname", KeyMod.CtrlCmd | KeyCode.KEY_S, (e) => {
  // will fire when press 'ctrl/cmd + s'
  console.log("keydown event with params:", e);
}

// Unregister keybind
kbd.unregister("mykeybindingname");

// Unregister all keybinding and remove instance from record.
kbd.dispose();

// Enable debug mode
KeyBinding.debug()

// Unregister all keybinding and remove all instance from record
kbd.dispose();
```

### Step.02 bind keybinding.js to your element

#### HTML

```js
// Add handler to dom
window.addEventListener('keydown',kbd.handler)
// Then remove in future
window.removeEventListener('keydown',kbd.handler)
```

#### Vue

```vue
<template>
  <!-- Add to keydown event -->
  <!-- Remember to set `tabindex` so that div can div can emit keydown event -->
  <div @keydown="kbd.handler" tabindex="0">
  </div>
</template>
<script>
// Remember to dispose in future. e.g. beforeUnmount or beforeDestroy
// kbd.dispose()
</script>
```

## Note

Since `keybinding.js` is pure js/ts without reactive/vue, you can use it any where as long as `kdb.handler` can be called with a `KeybordEvent` passing in.
