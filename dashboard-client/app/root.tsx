import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/sonner";
import { initSocketListeners } from "./store/wsLogs";
import { Provider } from "react-redux";
import store from "./store/store";
import { LogStorageProvider } from "./context/logs-context";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export default function App() {
  initSocketListeners();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <LogStorageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Outlet />
              <Toaster />
            </ThemeProvider>
          </LogStorageProvider>
        </Provider>

        <ScrollRestoration />
        <Scripts />
        {/* <LiveReload /> */}
      </body>
    </html>
  );
}
