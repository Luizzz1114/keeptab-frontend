export function fechaFormateada() {
  const fechaHoy = new Date();
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  const dia = fechaHoy.getDate().toString().padStart(2, '0');
  const mes = meses[fechaHoy.getMonth()];
  const anio = fechaHoy.getFullYear();

  return `${dia} ${mes} - ${anio}`;
}

export const formatTinyDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "Inválida";
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: true
  }).format(date);
};

export const formatearMonto = (monto: String | Number) => {
  const numero = Number(monto);
  if (isNaN(numero)) {
    return '0,00';
  }
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);
};
