import api from '@/api/axios';
import type { Venta } from '@/types/ventas.types';

export default {
  async create(venta: Venta) {
    const res = await api.post('/ventas', venta);
    return res.data;
  },
};
