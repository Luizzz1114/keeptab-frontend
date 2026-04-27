import api from '@/api/axios';
import type { Usuario } from '@/types/usuarios.types';

export default {
  async login(usuario: Usuario) {
    const res = await api.post('/auth/login', usuario);
    return res.data;
  },

  async logout() {
    const res = await api.post('/auth/logout');
    return res.data;
  },
};
