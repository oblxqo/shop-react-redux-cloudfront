import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "~/theme";
import { Buffer } from "buffer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

const credentials = { login: "oblxqo", password: "TEST_PASSWORD" };
const encodedCreds = Buffer.from(
  `${credentials.login}:${credentials.password}`
).toString("base64");
localStorage.setItem("authorization_token", encodedCreds);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("In axios.interceptors.response: error", error);
    if (error.response.status === 401) {
      toast.error(error.response.data.message);
    } else if (error.response.status === 403) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer position="top-right" />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
