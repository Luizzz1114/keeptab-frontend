import { z } from 'zod';

export const getClienteSchema = (validarCedula: (cedula: string) => Promise<boolean>) => {
  return z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio'),

    cedula: z
      .string()
      .trim()
      .min(1, 'La cédula es obligatoria')
      .regex(/^\d{7,8}$/, 'La cédula debe tener entre 7 y 8 números')
      .refine(validarCedula, { message: 'Esta cédula ya está registrada' }),

    contacto: z
      .string()
      .trim()
      .regex(/^$|^\d{4}-\d{6,8}$/, 'El teléfono tiene un formato inválido (Ej: 0414-1234567)')
      .optional(),
  });
};
