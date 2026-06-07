// =====================================================================
// CLIENTE DE API (api.ts)
// ---------------------------------------------------------------------
// Esta es la función "base" que TODOS los demás servicios (authService,
// reservationService, etc.) usan para hablar con el backend.
//
// Hace cuatro cosas importantes:
//   1) Arma la URL completa (base + endpoint)
//   2) Agrega el token JWT al header si existe
//   3) Maneja timeout y errores
//   4) Devuelve la respuesta ya parseada como JSON
// =====================================================================

// URL del backend. Si está en .env (VITE_API_URL), la usa; si no, localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Extendemos RequestInit (las opciones de fetch) para agregar timeout
interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Hace una petición HTTP al backend. <T> es el tipo de la respuesta esperada.
 * Por ejemplo: apiRequest<Usuario[]>('/users') devolvería un array de usuarios.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // Separamos timeout (nuestro) de las opciones normales de fetch
  const { timeout = 30000, ...fetchOptions } = options;

  // Armamos la URL completa, ej: http://localhost:4000/api/auth/signin
  const url = `${API_URL}/api${endpoint}`;
  
  // Si hay token guardado, lo recuperamos para enviarlo en el header
  const token = localStorage.getItem('token');
  
  // Construimos los headers, mezclando los nuestros con los que vengan
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Si tenemos token, lo agregamos como Bearer (formato estándar)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // En desarrollo mostramos en consola lo que vamos a enviar (útil para debug)
  const isDev = import.meta.env.DEV;
  if (isDev) {
    console.log(`[API] ${fetchOptions.method || 'GET'} ${url}`, {
      headers,
      body: fetchOptions.body,
    });
  }

  // AbortController permite cancelar la petición si tarda demasiado
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Hacemos la petición real al backend
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,  // así el timeout puede cancelarla
    });

    // Si la respuesta llegó, ya no necesitamos cancelarla
    clearTimeout(timeoutId);

    if (isDev) {
      console.log(`[API] Response: ${response.status}`, response);
    }

    // response.ok es true cuando el status está entre 200-299
    if (!response.ok) {
      // Intentamos leer el cuerpo de error. Si no hay JSON, dejamos {}.
      const error = await response.json().catch(() => ({})) as {
        message?: string;
        error?: string;
      };
      const errorMsg =
        error.error || error.message || `API error: ${response.status}`;
      if (isDev) {
        console.error(`[API] Error:`, errorMsg);
      }

      // 401 = sesión inválida o expirada. Limpiamos el token y, si no
      // estamos ya en la pantalla de auth ni validando la sesión, redirigimos.
      // (La validación de /auth/validate maneja su propio 401 sin redirigir.)
      if (response.status === 401 && !endpoint.startsWith('/auth/')) {
        localStorage.removeItem('token');
        localStorage.removeItem('mockAuth');
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          window.location.assign('/auth');
        }
      }

      // Lanzamos el error para que el componente que llamó pueda atraparlo.
      throw new Error(errorMsg);
    }

    // Algunas respuestas (DELETE, refunds, etc.) llegan vacías (status 204
    // o Content-Length: 0). Si intentáramos parsearlas como JSON tiraría
    // error. Detectamos esos casos y devolvemos null.
    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || contentLength === '0') {
      return null as unknown as T;
    }

    const text = await response.text();
    if (!text) {
      return null as unknown as T;
    }

    const data = JSON.parse(text) as T;
    if (isDev) {
      console.log(`[API] Data:`, data);
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (isDev) {
      console.error(`[API] Caught error:`, error);
    }
    // Relanzamos el error tal cual si ya es un Error de JS
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

export default apiRequest;
