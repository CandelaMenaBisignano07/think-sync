import type { Config } from "tailwindcss";

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
          lightPink: "#ffb6c1",
          navajoWhite: "#ffdead",
          gold: "#ffd700",
          powderBlue: "#b0e0e6",
          lightBlue: "#add8e6",
          paleGreen: "#98fb98",
          lightSalmon: "#ffa07a",
          salmon: "#fa8072",
          sandyBrown: "#f4a460",
          plum: "#dda0dd",
          mediumOrchid: "#ba55d3",
          mediumPurple: "#9370db",
          skyBlue: "#87ceeb",
          mediumSpringGreen: "#00fa9a",
          aquamarine: "#7fffd4",
          bisque: "#ffe4c4",
          hotPink: "#ff69b4",
          turquoise: "#40e0d0",
          darkTurquoise: "#00ced1",
          steelBlue: "#4682b4",
      },
      zIndex:{
        '2': "2"
      },
      gridTemplateColumns:{
        'home': '250px 1fr',
        'canvas' : '100px 1fr'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
} satisfies Config;
