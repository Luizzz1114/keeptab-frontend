import api from '@/api/axios';
import type { Cliente } from '@/types/clientes.types';

export default {
  async create(cliente: Cliente) {
    const res = await api.post('/clientes', cliente);
    return res.data;
  },

  async getAll() {
    const res = await api.get('/clientes');
    return res.data;
  },

  async search(cedula: Cliente['cedula']) {
    const res = await api.get(`/clientes?cedula=${cedula}`);
    return res.data;
  },

  async getById(id: Cliente['id']) {
    const res = await api.get(`/clientes/${id}`);
    return res.data;
  },

  async update(cliente: Cliente) {
    const res = await api.patch(`/clientes/${cliente.id}`, cliente);
    return res.data;
  },

  async remove(id: Cliente['id']) {
    const res = await api.delete(`/clientes/${id}`);
    return res.data;
  },
};
