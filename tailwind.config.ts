import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },

    colors: {
      bg: "#212121",
      "card-bg": "#2e2e2e",
      border: "#414141",
      text: "#ffffff",
    },
  },
  plugins: [],
} satisfies Config;
