/**
 * Reglas de validación reutilizables para formularios.
 */
export const getRules = () => {
  const required =
    (msg = "Campo requerido") =>
    (value) =>
      !!value || msg;
  const maxLength = (max, msg) => (value) =>
    !value || value.length <= max || msg;
  const minLength = (min, msg) => (value) =>
    !value || value.length >= min || msg;
  const regexMatch = (regex, msg) => (value) =>
    !value || regex.test(value) || msg;
  const fileMaxSize = (maxBytes, label) => (value) =>
    !value || value.size <= maxBytes || `Máximo ${label}`;
  const fileRequiredSize = (maxBytes, label) => (value) =>
    (value && value.size <= maxBytes) || `Máximo ${label}`;
  // ---- CURP (solo estructura) ----
  // Catálogo de entidades
  const CURP_STATES =
    "(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)";
  // Partes de la CURP
  const CURP_PREFIX = "[A-ZÑ][AEIOU][A-ZÑ]{2}"; // ap. paterno (inicial + vocal interna) + ap. materno + nombre
  const CURP_DATE = "\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])"; // YYMMDD (mes y día válidos)
  const CURP_SEX = "[HM]";
  const CURP_CONS = "[B-DF-HJ-NP-TV-ZÑ]{3}"; // consonantes internas
  const CURP_HOMO = "[0-9A-Z]"; // homoclave
  const CURP_DV = "\\d"; // dígito verificador (no se recalcula)
  const CURP_REGEX = new RegExp(
    `^${CURP_PREFIX}${CURP_DATE}${CURP_SEX}${CURP_STATES}${CURP_CONS}${CURP_HOMO}${CURP_DV}$`
  );
  // Normaliza y valida contra el patrón
  const isCurp = (value) => {
    if (!value) return true; // 'required' se encarga si aplica
    const v = String(value).trim().toUpperCase();
    return CURP_REGEX.test(v);
  };
  const curp =
    (msg = "CURP inválida") =>
    (value) =>
      isCurp(value) || msg;

  return {
    required: [required()],
    requiredNotNull: [(value) => value != null || "Campo requerido"],

    textRequired: [required(), minLength(2, "Mínimo 2 caracteres")],
    textOptional: [minLength(2, "Mínimo 2 caracteres")],

    emailRequired: [
      required(),
      maxLength(65, "Máximo 65 caracteres"),
      regexMatch(/.+@.+\..+/, "Formato inválido"),
    ],
    emailOptional: [
      maxLength(65, "Máximo 65 caracteres"),
      regexMatch(/.+@.+\..+/, "Formato inválido"),
    ],

    passwordRequired: [
      required(),
      minLength(8, "Mínimo 8 caracteres"),
      maxLength(30, "Máximo 30 caracteres"),
      regexMatch(/(?=.*[A-Z])/, "Al menos una mayúscula"),
      regexMatch(/(?=.*[a-z])/, "Al menos una minúscula"),
      regexMatch(/(?=.*[0-9])/, "Al menos un número"),
      regexMatch(/(?=.*[!@$%*])/, "Al menos un carácter especial (! @ $ % *)"),
    ],

    fileRequired: [required(), fileRequiredSize(1048576, "1MB")],
    fileOptional: [fileMaxSize(1048576, "1MB")],

    imageRequired: [required(), fileRequiredSize(2097152, "2MB")],
    imageOptional: [fileMaxSize(2097152, "2MB")],

    fiscalCodeRequired: [
      required(),
      maxLength(13, "Máximo 13 caracteres"),
      regexMatch(/^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/, "Formato inválido"),
    ],
    fiscalCodeOptional: [
      maxLength(13, "Máximo 13 caracteres"),
      regexMatch(/^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/, "Formato inválido"),
    ],

    zipRequired: [required(), regexMatch(/^\d{5}$/, "Ingresar 5 dígitos")],
    zipOptional: [regexMatch(/^\d{5}$/, "Ingresar 5 dígitos")],

    phoneRequired: [required(), regexMatch(/^\d{10}$/, "Ingresar 10 dígitos")],
    phoneOptional: [regexMatch(/^\d{10}$/, "Ingresar 10 dígitos")],

    curpRequired: [required(), curp()],
    curpOptional: [curp()],

    cycleRequired: [
      required(),
      regexMatch(/^\d{4}-\d+$/, "Formato inválido, usar AAAA-N"),
    ],
    cycleOptional: [regexMatch(/^\d{4}-\d+$/, "Formato inválido, usar AAAA-N")],
  };
};
