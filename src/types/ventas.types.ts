import type { Producto } from './productos.types';
import type { Cliente } from './clientes.types';

export interface Detalles {
  cantidad: number;
  producto_id: Producto['id'];
}

export interface Venta {
  id?: number;
  estatus: string;
  total: number;
  cliente_id?: Cliente['id'];
  detalles: Detalles[];
}
