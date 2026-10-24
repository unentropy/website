// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeNova from "starlight-theme-nova";

// https://astro.build/config
export default defineConfig({
  // Astro 7 defaults to "jsx", which strips whitespace between inline elements
  compressHTML: true,
  integrations: [
    starlight({
      title: "Unentropy",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: true,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/unentropy/unentropy",
        },
      ],
      customCss: [
        "./src/styles/fonts.css",
        "./src/styles/tokens.css",
        "./src/styles/custom.css",
      ],
      plugins: [starlightThemeNova(/* options */)],
    }),
  ],
});
