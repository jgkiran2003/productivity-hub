import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pickleball-yellow": "#FFD700", // Example yellow color
        "pickleball-green": "#7CFC00",  // Example green color
      },
    },
  },
  plugins: [],
};
export default config;
