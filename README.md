# Infocuenca front

Proyecto Vue 3 con Bootstrap 5, SCSS moderno y arquitectura de componentes encapsulados.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Características

- Vue 3 + Composition API
- Bootstrap 5 con SCSS moderno
- Componentes encapsulados (.vue + .js + .scss)
- Sistema de autenticación con Azure EntraID
- Arquitectura escalable

## Configuración EntraID

1. Ve a Azure Portal > App registrations > tu aplicación
2. En "Authentication", agrega estas URIs de redirección:
   - `http://localhost:5173/auth/login`
3. Habilita "Access tokens" e "ID tokens"
4. Verifica que tu archivo .env tenga los valores correctos

## Estructura de Componentes

Cada componente tiene su carpeta con:
- ComponentName.vue (template)
- ComponentName.js (lógica)
- ComponentName.scss (estilos)

Esto permite máxima encapsulación y mantenibilidad.
