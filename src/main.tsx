import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./shared/providers/ThemeProvider";
import { Toaster } from "./shared/components/ui/sonner";
import App from "./app/App.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App /> 
        <Toaster/>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
