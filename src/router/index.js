// 1) Imports
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

// 2) Historial (URLs limpias)
const base = import.meta.env.BASE_URL || "/";
const history = createWebHistory(base);

// 3) Router
const router = createRouter({ history, routes });

/* 4) Middlewares múltiples (pipeline)
   - meta.middleware acepta función, objeto { guard }, o arreglo de ambas
   - Se ejecutan en orden; cualquier redirect corta la cadena
*/
const toArray = (mw) => (Array.isArray(mw) ? mw : mw ? [mw] : []);

const makePipeline =
  (to, from, next, chain, index = 0) =>
  (params) => {
    if (params) return next(params); // redirección o cancelación
    const current = chain[index];
    if (!current) return next(); // fin de la cadena

    const nextStep = makePipeline(to, from, next, chain, index + 1);

    // a) Función legacy
    if (typeof current === "function") return current(to, from, nextStep);

    // b) Objeto con guard
    if (current && typeof current.guard === "function")
      return current.guard(to, from, nextStep);

    // c) Forma no válida → continuar
    return nextStep();
  };

// 5) Guard global
router.beforeEach((to, from, next) => {
  const chain = toArray(to.meta?.middleware);
  if (chain.length === 0) return next();
  const pipeline = makePipeline(to, from, next, chain);
  return pipeline();
});

// 6) Título
router.afterEach((to) => {
  const appName = import.meta.env.VITE_APP_NAME || "App";
  document.title = to.meta?.title ? `${appName} | ${to.meta.title}` : appName;
});

export default router;
