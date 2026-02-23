import { useStore } from "@/store";

const allow = (store) => !!(store.getAuth ?? store.auth)?.token;

const guard = (to, from, next) =>
  allow(useStore()) ? next() : next({ name: "login", replace: true });

export default { allow, guard };
