/// <reference types="vite/client" />
import { runPendingSetupEffects } from "retend";
import { createRouter } from "./router";

const router = createRouter();
router.setWindow(window);
router.attachWindowListeners();

const root = window.document.getElementById("app");
root?.append(router.Outlet() as Node);
runPendingSetupEffects();
