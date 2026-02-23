// Importación de middlewares
import Public from "./middleware/Public";
import Auth from "./middleware/Auth";
import { Roles } from "./middleware/Roles";

const routes = [
  {
    path: "/usuarios",
    name: "users",
    component: () => import("@/views/users/List.vue"),
    meta: {
      title: "Usuarios",
      icon: "mdi-account",
      middleware: [Auth, Roles([1, 2])],
    },
  },
  {
    path: "/usuarios/agregar",
    name: "users/store",
    component: () => import("@/views/users/Form.vue"),
    meta: {
      title: "Usuario | Agregar",
      icon: "mdi-account",
      middleware: [Auth, Roles([1, 2])],
    },
  },
  {
    path: "/usuarios/:id",
    name: "users/show",
    component: () => import("@/views/users/Show.vue"),
    props: true,
    meta: {
      title: "Usuario",
      icon: "mdi-account",
      middleware: [Auth, Roles([1, 2])],
    },
  },
  {
    path: "/usuarios/:id/editar",
    name: "users/update",
    component: () => import("@/views/users/Form.vue"),
    props: true,
    meta: {
      title: "Usuario | Editar",
      icon: "mdi-account",
      middleware: [Auth, Roles([1, 2])],
    },
  },

  /**
   * ===========================================
   * GENERAL
   * ===========================================
   */
  {
    path: "/inicio",
    name: "home",
    component: () => import("@/views/general/Home.vue"),
    meta: {
      title: "Inicio",
      middleware: [Auth],
    },
  },
  {
    path: "/no_autorizado",
    name: "unauthorized",
    component: () => import("@/views/general/Unauthorized.vue"),
    meta: {
      title: "Acceso Denegado",
      middleware: [Auth],
    },
  },

  /**
   * ===========================================
   * PUBLIC
   * ===========================================
   */
  {
    path: "/iniciar_sesion",
    name: "login",
    component: () => import("@/views/public/UserLogin.vue"),
    meta: {
      title: "Iniciar sesión",
      middleware: [Public],
    },
  },
  {
    path: "/crear_cuenta_medico",
    name: "doctors/store",
    component: () => import("@/views/public/DoctorStore.vue"),
    meta: {
      title: "Médico",
      icon: "mdi-doctor",
      middleware: [Public],
    },
  },
  {
    path: "/",
    name: "main",
    component: () => import("@/views/public/Main.vue"),
    meta: {
      title: "MedicPay",
      middleware: [Public],
    },
  },
  {
    path: "/recuperar_contrasena",
    name: "user_password_recover",
    component: () => import("@/views/public/UserPasswordRecover.vue"),
    meta: {
      title: "Recuperar contraseña",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/restablecer_contrasena/:id",
    name: "user_password_reset",
    component: () => import("@/views/public/UserPasswordReset.vue"),
    meta: {
      title: "Restablecer contraseña",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/confirmar_cuenta/:id",
    name: "user_account_confirm",
    component: () => import("@/views/public/UserAccountConfirm.vue"),
    meta: {
      title: "Confirmar cuenta",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/facturacion/:id",
    name: "consultation_stamp",
    component: () => import("@/views/public/ConsultationStamp.vue"),
    meta: {
      title: "Facturación",
      icon: "mdi-invoice",
      middleware: [Public],
    },
  },
  {
    path: "/pagoConsulta/:id",
    name: "consultation_payment",
    component: () => import("@/views/public/ConsultationPayment.vue"),
    meta: {
      title: "Pago con tarjeta",
      icon: "mdi-credit-card-outline",
      middleware: [Public],
    },
  },

  /**
   * ===========================================
   * NOT FOUND
   * ===========================================
   */
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: () => import("@/views/public/NotFound.vue"),
  },
];

export default routes;
