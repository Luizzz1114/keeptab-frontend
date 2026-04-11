export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  contable: boolean;
  stock: number | null;
  precio: number;
}