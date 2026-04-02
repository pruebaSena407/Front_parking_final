# Configuración del Entorno Virtual

Este proyecto incluye un entorno virtual de Python para gestionar las dependencias de manera aislada.

## Activación del Entorno Virtual

### Opción 1: Usando el script batch (Recomendado en Windows)
1. Haz doble clic en `activate_venv.bat`
2. Se abrirá una nueva ventana de comando con el entorno activado

### Opción 2: Activación manual
1. Abre una terminal de comandos (cmd) en la raíz del proyecto
2. Ejecuta: `venv\Scripts\activate.bat`
3. Verás `(venv)` al inicio de la línea de comandos

## Instalación de Dependencias

Una vez activado el entorno virtual:

```bash
pip install -r requirements.txt
```

## Verificación

Para verificar que el entorno está funcionando:

```bash
python --version
pip list
```

## Desactivación

Para salir del entorno virtual:

```bash
deactivate
```

## Notas Importantes

- El entorno virtual está incluido en `.gitignore` para no subirlo al repositorio
- Si necesitas agregar nuevas dependencias, actualiza `requirements.txt`
- Recuerda activar el entorno virtual antes de trabajar con código Python