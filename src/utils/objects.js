/**
 * Objeto base para formularios de usuario.
 * @returns {Object} Estructura inicial de usuario.
 */
export const getUserObj = () => ({
  id: null,
  is_active: 1,
  role_id: null,
  name: null,
  paternal_surname: null,
  maternal_surname: null,
  curp: null,
  email: null,
  phone: null,
  avatar_path: null,
  avatar_doc: null,
  avatar_dlt: false,
});
