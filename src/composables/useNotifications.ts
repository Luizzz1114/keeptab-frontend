import { useToast } from 'primevue/usetoast';

export function useNotifications() {
  const toast = useToast();

  const showSuccess = (message = 'Operación realizada correctamente') => {
    toast.add({
      severity: 'success',
      summary: 'Operación exitosa',
      detail: message,
      life: 5000,
    });
  };

  const showError = (message = 'Ha ocurrido un error') => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000,
    });
  };

  const showWarning = (message = 'Ha ocurrido un error') => {
    toast.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message,
      life: 5000,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
  };
}
