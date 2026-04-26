// --- Formatear montos / dinero ---
export const formatCurrency = (amount: string | number) => {
  const number = Number(amount);
  if (isNaN(number)) return '0,00';
  const formattedNumber = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
  return `${formattedNumber} Bs.`;
};

// --- Obtener fecha formateada ---
export function getFormattedDate() {
  const today = new Date();
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = today.getDate().toString().padStart(2, '0');
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  return `${day} ${month} - ${year}`;
}

export const formatTinyDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Inválida';
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: true,
  }).format(date);
};

export const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Hace un momento';
  if (diffMins === 1) return 'Hace 1 minuto';
  if (diffMins < 60) return `Hace ${diffMins} minutos`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return 'Hace 1 hora';
  if (diffHours < 24) return `Hace ${diffHours} horas`;
  return 'Hace varios días';
};
