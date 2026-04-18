export interface Jornada {
  id?: number;
  apertura?: Date;
  cierre?: Date | null;
  fondo_inicial?: number;
  estatus?: string;
  total_ventas?: number;
  total_fisico?: number;
  diferencia?: number;
}

export interface JornadaActual {
  id?: number;
  abierta_desde?: Date;
  fondo_inicial?: number;
  ventas_efectivo?: number;
  total_esperado?: number;
}