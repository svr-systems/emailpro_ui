import { useRouter } from "vue-router";
import { useStore } from "@/store";

const toArray = (mw) => (Array.isArray(mw) ? mw : mw ? [mw] : []);

const allowByMiddleware = (mw, store) => {
  if (mw && typeof mw.allow === "function") return !!mw.allow(store); // objeto {allow, guard}
  if (typeof mw === "function") return true; // legacy: visible en UI
  return true;
};

export const useAccess = () => {
  const router = useRouter();
  const store = useStore();

  const canAccessRoute = (routeName) => {
    const r = router.getRoutes().find((x) => x.name === routeName);
    if (!r) return false;
    const mws = toArray(r.meta?.middleware);
    if (mws.length === 0) return true;
    return mws.every((mw) => allowByMiddleware(mw, store)); // AND
  };

  const filterMenuItemsByAccess = (items = []) =>
    items.filter((i) => canAccessRoute(i.link));

  return { canAccessRoute, filterMenuItemsByAccess };
};
