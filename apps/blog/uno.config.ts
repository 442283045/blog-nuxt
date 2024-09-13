// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetIcons({
      /* options */
      collections: {
        'material-symbols': () =>
          import('@iconify-json/material-symbols/icons.json').then(
            i => i.default as any,
          ),
      },
    }),
    presetAttributify({}),
    // ...other presets
  ],
  // transformers: [transformerDirectives()]
})
