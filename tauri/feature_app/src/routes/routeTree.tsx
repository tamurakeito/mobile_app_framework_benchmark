import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import Home from "../pages/Home";
import Counter from "../pages/Counter";
import Api from "../pages/Api";
import Camera from "../pages/Camera";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const counterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/counter",
  component: Counter,
});

const apiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/api",
  component: Api,
});

const cameraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/camera",
  component: Camera,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: Notifications,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  counterRoute,
  apiRoute,
  cameraRoute,
  notificationsRoute,
  settingsRoute,
]);
