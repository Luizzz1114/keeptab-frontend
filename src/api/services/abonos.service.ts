import api from '@/api/axios';
import type { Abono } from '@/types/abonos.types';

export default {
  async create(abono: Abono) {
    const res = await api.post('/abonos', abono);
    return res.data;
  },
};
