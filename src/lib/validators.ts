// =====================================================================
// VALIDADORES REUTILIZABLES (validators.ts)
// ---------------------------------------------------------------------
// Aquí centralizamos las reglas de validación que antes estaban
// repetidas en los formularios (AuthPage, Login, etc.).
//
// Cada función devuelve:
//   - null  → si el dato es válido
//   - string → con el mensaje de error si NO es válido
//
// Así, en el formulario es muy fácil hacer:
//   const error = validateEmail(value);
//   if (error) { toast({ title: "Error", description: error }); return; }
// =====================================================================

/** Verifica que el correo tenga formato válido. */
export const validateEmail = (email: string): string | null => {
  if (!email) return "El correo es obligatorio.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Ingresa un correo electrónico válido.";
  return null;
};

/** Verifica que el nombre completo tenga al menos 2 palabras (nombre + apellido). */
export const validateFullName = (fullName: string): string | null => {
  if (!fullName) return "El nombre es obligatorio.";
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length < 2) {
    return "El nombre completo debe incluir nombre y apellido.";
  }
  return null;
};

/** Verifica que el teléfono tenga solo dígitos y entre 10 y 15 caracteres. */
export const validatePhone = (phone: string): string | null => {
  if (!phone) return "El teléfono es obligatorio.";
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return "El número de teléfono debe contener solo números y tener entre 10 y 15 dígitos.";
  }
  return null;
};

/**
 * Verifica que la contraseña sea "fuerte":
 *   - al menos 8 caracteres
 *   - una mayúscula
 *   - una minúscula
 *   - un número
 *   - un carácter especial
 *
 * Devuelve el primer error que encuentra (igual que el backend).
 */
export const validatePasswordStrength = (password: string): string | null => {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!/[A-Z]/.test(password)) {
    return "La contraseña debe contener al menos una letra mayúscula.";
  }
  if (!/[a-z]/.test(password)) {
    return "La contraseña debe contener al menos una letra minúscula.";
  }
  if (!/\d/.test(password)) {
    return "La contraseña debe contener al menos un número.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "La contraseña debe contener al menos un carácter especial.";
  }
  return null;
};

/** Verifica que dos contraseñas coincidan. */
export const validatePasswordMatch = (
  password: string,
  confirm: string
): string | null => {
  if (password !== confirm) return "Las contraseñas no coinciden.";
  return null;
};
