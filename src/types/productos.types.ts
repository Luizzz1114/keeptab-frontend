export interface Producto {
  id?: number;
  nombre: string;
  categoria: string;
  conteo: boolean;
  stock: number | null;
  precio: number;
}

export interface CartItem { 
  producto: Producto; 
  cantidad: number; 
}