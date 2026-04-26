import type { Producto } from './productos.types';
import type { Cliente } from './clientes.types';
import type { Abono } from './abonos.types';

export interface Venta {
  id?: number;
  estatus: string;
  total: number;
  cliente?: Cliente;
  cliente_id?: Cliente['id'];
  detalles: DetalleVenta[];
  abonos?: Abono[];
  created_at?: any;
  fecha?: string;
}

export interface DetalleVenta {
  id?: number;
  subtotal?: number;
  cantidad?: number;
  precio_unitario?: number;
  producto_id: Producto['id'];
  producto?: Producto;
}
