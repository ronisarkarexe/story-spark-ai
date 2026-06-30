import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import { ThemeProvider } from "./components/theme/theme.context";
import "./index.css";


const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();

if (!GOOGLE_CLIENT_ID) {
  console.warn("VITE_GOOGLE_CLIENT_ID is missing. Google Login will not function.");
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element. Ensure index.html has <div id='root'></div>");
}

createRoot(container).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || "dummy-client-id"}>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);