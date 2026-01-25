import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./shared/providers/ThemeProvider";

import App from "./app/App.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { Toaster } from "./components/ui/sonner.tsx";



createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
        <App /> 
        <Toaster/>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
);
