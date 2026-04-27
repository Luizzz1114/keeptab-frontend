export interface Usuario {
  id?: number;
  username?: string;
  rol?: string;
}

export interface UsuarioForm {
  id?: number;
  username?: string;
  password?: string;
  confirmPassword?: string;
  rol?: string;
}
