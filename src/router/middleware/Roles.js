import { useStore } from "@/store";

export const Roles = (allowed = []) => {
  const allow = (store) => {
    const auth = store.getAuth ?? store.auth;
    const roleId = Number(auth?.user?.role_id);
    return !!auth?.token && allowed.includes(roleId);
  };

  const guard = (to, from, next) =>
    allow(useStore()) ? next() : next({ name: "unauthorized", replace: true });

  return { allow, guard };
};
