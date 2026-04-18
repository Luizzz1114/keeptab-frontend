import api from '@/api/axios';
import type { Producto } from '@/types/productos.types';

export default {
  async create(producto: Producto) {
    const res = await api.post('/productos', producto);
    return res.data;
  },

  async getAll() {
    const res = await api.get('/productos');
    return res.data;
  },

  async search(nombre: Producto['nombre']) {
    const res = await api.get(`/productos?nombre=${nombre}`);
    return res.data;
  },

  async getById(id: Producto['id']) {
    const res = await api.get(`/productos/${id}`);
    return res.data;
  },

  async update(producto: Producto) {
    const res = await api.patch(`/productos/${producto.id}`, producto);
    return res.data;
  },

  async remove(id: Producto['id']) {
    const res = await api.delete(`/productos/${id}`);
    return res.data;
  },
};
