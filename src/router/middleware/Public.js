import { useStore } from "@/store";

const allow = () => true;

const guard = (to, from, next) => {
  const auth = useStore().getAuth ?? useStore().auth;
  return auth?.token ? next({ name: "home", replace: true }) : next();
};

export default { allow, guard };
