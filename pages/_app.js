// pages/_app.js
import "tailwindcss/tailwind.css";
import "../pages/globals.css";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="system" attribute="data-theme">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
