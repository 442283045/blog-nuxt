// uno.config.ts
import {
  defineConfig,
  presetIcons,
  presetUno,
  presetAttributify,
} from "unocss";

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetIcons({
      /* options */
      collections: {
        "material-symbols": () =>
          import("@iconify-json/material-symbols/icons.json").then(
            (i) => i.default as any
          ),
      },
    }),
    presetAttributify({}),
    // ...other presets
  ],
});
