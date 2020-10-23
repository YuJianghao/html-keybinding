const { KeyBinding, KeyMod, KeyCode } = kbjs

// 0. Enable debug mode (optional)
KeyBinding.debug()

// 1. Create instance
const kbd1 = new KeyBinding('kbd1')
const kbd2 = KeyBinding.createInstance('kbd2')

// 2. Register keybinding
kbd1.register('binding1', KeyMod.CtrlCmd | KeyCode.KEY_X, (e) => {
  console.log(`My kbd1:binding1 keydown event handler was fired`)
  console.log(e)
})

KeyBinding.register('kbd2', 'binding2', KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KEY_X, (e) => {
  console.log(`My kbd2:binding2 keydown event handler was fired`)
  console.log(e)
})

// 3. Add handlers
window.addEventListener('keydown', kbd1.handler)
window.addEventListener('keydown', KeyBinding.getInstance('kbd2').handler)

console.log('Please try [ctrl/cmd + x] or [ctrl/cmd + shift + x] within 10 seconds')

window.setTimeout(() => {
  // 4. Unregister keybinding
  kbd1.unregister('binding1')
  KeyBinding.unregister('kbd2', 'binding2')

  console.log('Please try [ctrl/cmd + x] or [ctrl/cmd + shift + x] within 10 seconds')

  // 5. Remove handlers in future
  window.setTimeout(() => {
    window.removeEventListener('keydown', kbd1.handler)
    window.removeEventListener('keydown', KeyBinding.getInstance('kbd2').handler)

    // 6. dispose KeyBinding if not needed anymore
    kbd1.dispose()
    KeyBinding.getInstance('kbd2').dispose()

    // or
    KeyBinding.dispose()

    console.log('Please try [ctrl/cmd + x] or [ctrl/cmd + shift + x] within 10 seconds')

  }, 10000)

}, 10000)