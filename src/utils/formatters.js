/**
 * Retorna la fecha y, opcionalmente, la hora actual con separadores personalizados.
 *
 * @param {string} dateSep - Separador entre año, mes y día (default: '-').
 * @param {string} dateTimeSep - Separador entre fecha y hora (default: ' ').
 * @param {string} timeSep - Separador entre horas, minutos y segundos (default: ':').
 * @param {boolean} showTime - Si true, incluye HH:MM:SS; si false, solo la fecha (default: true).
 * @returns {string} Fecha en formato YYYY-MM-DD [HH:MM:SS].
 */
export const getDateTime = (
  dateSep = "-",
  dateTimeSep = " ",
  timeSep = ":",
  showTime = true
) => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const date = [year, month, day].join(dateSep);

  if (!showTime) {
    return date;
  }

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const time = [hours, minutes, seconds].join(timeSep);

  return `${date}${dateTimeSep}${time}`;
};

/**
 * Formatea un número como monto en USD con dos decimales.
 * Retorna '-' si el valor no es válido.
 * @param {number|string|null} value - Valor a formatear.
 * @returns {string} Monto formateado o '-'.
 */
export const getAmountFormat = (value) => {
  if (value === null || value === "") return "-";

  const numeric = parseFloat(value);
  if (isNaN(numeric)) return "-";

  return numeric.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formatea un número como porcentaje.
 * Retorna '-' si el valor no es válido.
 * @param {number|string|null} value - Valor a formatear.
 * @returns {string} Porcentaje formateado o '-'.
 */
export const getPercentFormat = (value) => {
  if (value === null || value === "") return "-";

  const numeric = parseFloat(value);
  if (isNaN(numeric)) return "-";

  return `${numeric}%`;
};
