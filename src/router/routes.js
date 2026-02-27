// Importación de middlewares
import Public from "./middleware/Public";
import Auth from "./middleware/Auth";
import { Roles } from "./middleware/Roles";

const routes = [
  /**
 * ===========================================
 * USERS
 * ===========================================
 */
  {
    path: "/usuarios",
    name: "users",
    component: () => import("@/views/users/List.vue"),
    meta: {
      title: "Usuarios",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/usuarios/agregar",
    name: "users/store",
    component: () => import("@/views/users/Form.vue"),
    meta: {
      title: "Usuario | Agregar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/usuarios/:id",
    name: "users/show",
    component: () => import("@/views/users/Show.vue"),
    props: true,
    meta: {
      title: "Usuario",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/usuarios/:id/editar",
    name: "users/update",
    component: () => import("@/views/users/Form.vue"),
    props: true,
    meta: {
      title: "Usuario | Editar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([1])],
    },
  },

  /**
* ===========================================
* CLIENTS
* ===========================================
*/
  {
    path: "/clientes",
    name: "clients",
    component: () => import("@/views/clients/List.vue"),
    meta: {
      title: "Clientes",
      icon: "mdi-account",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/clientes/agregar",
    name: "clients/store",
    component: () => import("@/views/clients/Form.vue"),
    meta: {
      title: "Clientes | Agregar",
      icon: "mdi-account",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/clientes/:id",
    name: "clients/show",
    component: () => import("@/views/clients/Show.vue"),
    props: true,
    meta: {
      title: "Clientes",
      icon: "mdi-account",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/clientes/:id/editar",
    name: "clients/update",
    component: () => import("@/views/clients/Form.vue"),
    props: true,
    meta: {
      title: "Clientes | Editar",
      icon: "mdi-account",
      middleware: [Auth, Roles([1])],
    },
  },

  /**
* ===========================================
* DOMAINS
* ===========================================
*/
  {
    path: "/dominios/:id",
    name: "domains",
    component: () => import("@/views/domains/List.vue"),
    props: true,
    meta: {
      title: "Dominios",
      icon: "mdi-cloud",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/dominios/:client/agregar",
    name: "domains/store",
    component: () => import("@/views/domains/Form.vue"),
    props: true,
    meta: {
      title: "Dominio | Agregar",
      icon: "mdi-cloud",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/dominios/:client/:id",
    name: "domains/show",
    component: () => import("@/views/domains/Show.vue"),
    props: true,
    meta: {
      title: "Dominio",
      icon: "mdi-cloud",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/dominios/:client/:id/editar",
    name: "domains/update",
    component: () => import("@/views/domains/Form.vue"),
    props: true,
    meta: {
      title: "Dominio | Editar",
      icon: "mdi-cloud",
      middleware: [Auth, Roles([1])],
    },
  },

  /**
* ===========================================
* EMAILS
* ===========================================
*/
  {
    path: "/correos/:domain/:id",
    name: "emails",
    component: () => import("@/views/emails/List.vue"),
    props: true,
    meta: {
      title: "Correos",
      icon: "mdi-email",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/correos/:domain/:email/agregar",
    name: "emails/store",
    component: () => import("@/views/emails/Form.vue"),
    props: true,
    meta: {
      title: "Correo | Agregar",
      icon: "mdi-email",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/correos/:domain/:email/:id",
    name: "emails/show",
    component: () => import("@/views/emails/Show.vue"),
    props: true,
    meta: {
      title: "Correo",
      icon: "mdi-email",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/correos/:domain/:email/:id/editar",
    name: "emails/update",
    component: () => import("@/views/emails/Form.vue"),
    meta: {
      title: "Correo | Editar",
      icon: "mdi-email",
      middleware: [Auth, Roles([1])],
    },
  },

  /**
* ===========================================
* CLIENTS_SECTIONS
* ===========================================
*/
  /**
* ===========================================
* DOMAINS
* ===========================================
*/
  {
    path: "/cliente/dominios",
    name: "client_domains",
    component: () => import("@/views/clients_section/domains/List.vue"),
    meta: {
      title: "Dominios",
      icon: "mdi-cloud",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/cliente/dominios/:id",
    name: "client_domains/show",
    component: () => import("@/views/clients_section/domains/Show.vue"),
    props: true,
    meta: {
      title: "Dominio",
      icon: "mdi-cloud",
      middleware: [Auth, Roles([2])],
    },
  },

  /**
* ===========================================
* EMAILS
* ===========================================
*/
  {
    path: "/cliente/correos/:id",
    name: "client_emails",
    component: () => import("@/views/clients_section/emails/List.vue"),
    props: true,
    meta: {
      title: "Correos",
      icon: "mdi-email",
      middleware: [Auth, Roles([2])],
    },
  },

  /**
* ===========================================
* PAYMENTS
* ===========================================
*/
  {
    path: "/cliente/pagos/:id",
    name: "client_payments",
    component: () => import("@/views/clients_section/payments/List.vue"),
    props: true,
    meta: {
      title: "Pagos",
      icon: "mdi-cash",
      middleware: [Auth, Roles([2])],
    },
  },

  /**
* ===========================================
* FISCAL_DATA
* ===========================================
*/

  {
    path: "/datosfiscales",
    name: "fiscal_data",
    component: () => import("@/views/clients_section/FiscalData.vue"),
    meta: {
      title: "Datos Fiscales",
      icon: "mdi-scale-balance",
      middleware: [Auth, Roles([2])],
    },
  },

  /**
* ===========================================
* CARDS
* ===========================================
*/

  {
    path: "/tarjetas",
    name: "cards",
    component: () => import("@/views/clients_section/Cards.vue"),
    meta: {
      title: "Tarjetas",
      icon: "mdi-credit-card",
      middleware: [Auth, Roles([2])],
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
