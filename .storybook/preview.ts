/// <reference types="vite/client" />
import type { Preview } from "@storybook/react-vite";
import "@fontsource/inter/700.css";
import "../src/styles/global.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
