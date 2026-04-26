import api from '@/api/axios';
import type { Venta } from '@/types/ventas.types';

export default {
  async create(venta: Venta) {
    const res = await api.post('/ventas', venta);
    return res.data;
  },

  async getById(id: Venta['id']) {
    const res = await api.get(`/ventas/${id}`);
    return res.data;
  },

  async remove(id: Venta['id']) {
    const res = await api.delete(`/ventas/${id}`);
    return res.data;
  },
};
