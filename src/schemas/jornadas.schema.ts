import { z } from 'zod';

export const createJornadaSchema = z.object({
  fondo_inicial: z.number({ message: 'El fondo inicial es obligatorio' })
    .min(0, 'El fondo inicial no puede ser negativo'),
});

export const updateJornadaSchema = z.object({
  total_fisico: z.number({ message: 'El total físico es obligatorio' })
    .min(0, 'El total físico no puede ser negativo'),
});
