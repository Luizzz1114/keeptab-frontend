import type { Venta } from './ventas.types';

export interface Cliente {
  id?: number;
  nombre: string;
  cedula: string;
  contacto: string;
  deuda?: number;
  ventas?: Venta[];
}
