import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router-dom";
import { App } from "@/app/App";
import { createAppQueryClient } from "@/app/query-client";
import { appRoutes } from "@/app/router";

type RenderAppOptions = Readonly<{
  initialEntries?: string[];
}>;

export function renderApp(options: RenderAppOptions = {}) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: options.initialEntries ?? ["/"],
  });
  const queryClient = createAppQueryClient();

  return {
    ...render(<App queryClient={queryClient} router={router} />),
    queryClient,
    router,
  };
}
