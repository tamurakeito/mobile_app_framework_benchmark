import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routes/routeTree";
import { CounterProvider } from "./contexts/CounterContext";
import "./App.css";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CounterProvider>
        <RouterProvider router={router} />
      </CounterProvider>
    </QueryClientProvider>
  );
}

export default App;
