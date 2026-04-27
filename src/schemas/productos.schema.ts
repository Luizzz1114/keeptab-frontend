import { z } from 'zod';

export const getProductoSchema = (
  validarNombre: (nombre: string) => Promise<boolean>
) => {
  return z.object({
    nombre: z.string().trim()
      .min(1, 'El nombre es obligatorio')
      .max(50, 'No puede tener más de 50 caracteres')
      .refine(validarNombre, { message: 'Este producto ya está registrado' }),
    categoria: z.any()
      .refine((val) => val !== null && val !== undefined && val !== '', 'Seleccione una categoría'),
    precio: z
      .number()
      .min(1, 'El precio no puede ser cero o negativo'),
    conteo: z.boolean({ message: 'Seleccione una opción' }),
    stock: z.number()
      .min(0, 'No puede ser negativo')
      .max(1000, 'El máximo permitido es 1000')
      .nullable()
      .optional()
  })
  .superRefine((data, ctx) => {
    if (data.conteo === true && (data.stock === null || data.stock === undefined)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Debe indicar el stock inicial',
        path: ['stock']
      });
    }
  });
}

export const productCategories: string[] = [
  'Comestibles', 
  'Artículos de limpieza', 
  'Bebidas', 
  'Higiene personal', 
  'Lácteos y Embutidos', 
  'Snacks y Dulces', 
  'Papelería',
  'Otros'
];

export const iconsByCategory: { [key: string]: string } = {
  'Comestibles': 'fi-rr-restaurant',
  'Artículos de limpieza': 'fi-rr-broom',
  'Bebidas': 'fi-rr-drink-alt',
  'Higiene personal': 'fi-rr-soap',
  'Lácteos y Embutidos': 'fi-rr-cheese',
  'Snacks y Dulces': 'fi-rr-bowl-soft-serve',
  'Papelería': 'fi-rr-document',
  'Otros': 'fi-rr-apps'
};

export const countingOptions = [
  { label: 'Si', value: true },
  { label: 'No', value: false },
];