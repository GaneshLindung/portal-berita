// pages/_app.js
import "../styles/globals.css";
import { ThemeProvider } from "../components/ThemeContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
