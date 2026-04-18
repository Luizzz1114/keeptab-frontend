import { z } from 'zod';

const contrasenaBaseSchema = z.string({ message: 'La contraseña es obligatoria' })
  .min(8, 'La contraseña debe tener mínimo 8 caracteres')
  .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
  .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'La contraseña debe contener al menos un número');

export const getUsuarioSchema = (
  isEdit: boolean = false,
  validarUsername: (username: string) => Promise<boolean>
) => {
  return z.object({
    rol: z.string({ message: 'Seleccione un rol' }).trim()
      .min(1, 'Seleccione un rol'),
    
    username: z.string({ message: 'El nombre de usuario es obligatorio' }).trim()
      .min(3, 'El nombre de usuario debe tener mínimo 3 caracteres')
      .max(20, 'El nombre de usuario debe tener máximo 20 caracteres')
      .refine(validarUsername, { message: 'Este nombre de usuario ya está en uso' }),
    
    password: isEdit 
      ? z.union([contrasenaBaseSchema, z.literal(''), z.undefined()]) 
      : contrasenaBaseSchema,
    
    confirmPassword: isEdit 
      ? z.string().optional()
      : z.string({ message: 'Confirmar la contraseña es obligatorio' }).min(1, 'Debes confirmar la contraseña'),
  })
  .refine((data) => {
    if (isEdit && (!data.password || data.password === '')) {
      return true;
    }
    return data.password === data.confirmPassword;
  }, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });
};

export const roles = [
  { label: 'Administador', value: 'ADMIN' },
  { label: 'Usuario', value: 'USER' },
];