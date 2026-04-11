export function fechaFormateada() {
  const fechaHoy = new Date();
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  const dia = fechaHoy.getDate().toString().padStart(2, '0');
  const mes = meses[fechaHoy.getMonth()];
  const anio = fechaHoy.getFullYear();

  return `${dia} ${mes} - ${anio}`;
}