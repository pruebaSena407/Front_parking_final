// =====================================================================
// PUNTO DE ENTRADA DEL FRONTEND (main.tsx)
// ---------------------------------------------------------------------
// Este archivo es lo PRIMERO que ejecuta el navegador cuando carga la
// página. Lo que hace es:
//   1) Encontrar el <div id="root"> que está en index.html
//   2) "Montar" dentro de él el componente raíz <App />
//   3) Cargar los estilos globales (index.css)
// =====================================================================

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// document.getElementById("root") puede ser null, pero el "!" le dice
// a TypeScript: "tranquilo, yo sé que no es null".
// createRoot crea el "punto de montaje" de React 18.
createRoot(document.getElementById("root")!).render(<App />);
