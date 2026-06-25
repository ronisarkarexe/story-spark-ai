import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
main

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element. Ensure index.html has <div id='root'></div>");
}

createRoot(container).render(
  <StrictMode>
    {/* <HelmetProvider> */}
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || "dummy-client-id"}>
        <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Provider>
      </GoogleOAuthProvider>
    {/* </HelmetProvider> */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || "dummy-client-id"}>
      <Provider store={store}>
main
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
main
