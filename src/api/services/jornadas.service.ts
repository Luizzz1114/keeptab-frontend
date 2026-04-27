import api from '@/api/axios';
import type { Jornada } from '@/types/jornadas.types';

export default {
  async open(jornada: Jornada) {
    const res = await api.post('/jornadas/abrir', jornada);
    return res.data;
  },

  async getAll() {
    const res = await api.get('/jornadas');
    return res.data;
  },

  async getActual() {
    const res = await api.get('/jornadas/actual');
    return res.data;
  },

  async getById(id: Jornada['id']) {
    const res = await api.get(`/jornadas/${id}`);
    return res.data;
  },

  async close(jornada: Jornada) {
    const res = await api.patch(`/jornadas/${jornada.id}/cerrar`, jornada);
    return res.data;
  },

  async remove(id: Jornada['id']) {
    const res = await api.delete(`/jornadas/${id}`);
    return res.data;
  },
};
