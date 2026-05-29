import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./components/theme/theme.context";

// --- PWA Service Worker Registration ---
import { registerSW } from "virtual:pwa-register";

// This automatically registers the service worker and updates it when needed
// allowing your app to cache data and work offline.
registerSW({ immediate: true });

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
