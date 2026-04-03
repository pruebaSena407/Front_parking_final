// Cliente de integración falso para quitar la dependencia de Supabase en el frontend.
// Se mantiene la carpeta /integrations/supabase para compatibilidad con importaciones.

export const supabase = {
  auth: {
    onAuthStateChange: (_cb: unknown) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: async () => ({ data: { session: null } }),
    signInWithPassword: async () => ({ error: new Error("Modo demo: operacion de login local") }),
    signUp: async () => ({ error: new Error("Modo demo: operacion de signup local") }),
    signOut: async () => ({ error: null }),
    admin: {
      getUserById: async () => ({ user: null }),
    },
  },
  from: () => ({ select: async () => ({ data: [], error: null }), insert: async () => ({ data: [], error: null }), upsert: async () => ({ data: [], error: null }), update: async () => ({ data: [], error: null }), delete: async () => ({ data: null, error: null }), eq: () => ({ select: async () => ({ data: [], error: null }), order: () => ({ limit: () => ({ select: async () => ({ data: [], error: null }) }) })}) }),
};