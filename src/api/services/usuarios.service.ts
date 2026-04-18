import api from '@/api/axios';
import type { Usuario } from '@/types/usuarios.types';

export default {
  async create(usuario: Usuario) {
    const res = await api.post('/usuarios', usuario);
    return res.data;
  },

  async getAll() {
    const res = await api.get('/usuarios');
    return res.data;
  },

  async search(username: Usuario['username']) {
    const res = await api.get(`/usuarios?username=${username}`);
    return res.data;
  },

  async getById(id: Usuario['id']) {
    const res = await api.get(`/usuarios/${id}`);
    return res.data;
  },

  async update(usuario: Usuario) {
    const res = await api.patch(`/usuarios/${usuario.id}`, usuario);
    return res.data;
  },

  async remove(id: Usuario['id']) {
    const res = await api.delete(`/usuarios/${id}`);
    return res.data;
  },
};
