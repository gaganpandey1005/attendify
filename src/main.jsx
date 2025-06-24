import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";

// ✅ Register PWA service worker
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Refresh?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
