# Política de Seguridad

## Versiones Soportadas

| Versión | Soportada |
| ------- | --------- |
| 0.0.x   | ✅        |

## Reportar una Vulnerabilidad

Tomamos muy en serio la seguridad de Patto CLI. Si descubres una vulnerabilidad de seguridad, por favor sigue estos pasos:

### 1. **NO** Abras un Issue Público

Las vulnerabilidades de seguridad no deben divulgarse públicamente hasta que hayan sido resueltas.

### 2. Contáctanos Privadamente

Envía un correo electrónico a **hormigadev7@gmail.com** con:

-   **Asunto:** `[SEGURIDAD] Reporte de Vulnerabilidad en Patto CLI`
-   **Descripción:** Descripción detallada de la vulnerabilidad
-   **Pasos para Reproducir:** Pasos claros para reproducir el problema
-   **Impacto:** ¿Qué podría hacer potencialmente un atacante?
-   **Solución Sugerida:** Si tienes ideas de cómo solucionarlo (opcional)
-   **Tu Información de Contacto:** Para que podamos hacer seguimiento

### 3. Qué Esperar

-   **Confirmación:** Confirmaremos la recepción de tu reporte dentro de **48 horas**
-   **Evaluación:** Evaluaremos la vulnerabilidad y determinaremos su severidad
-   **Actualizaciones:** Te mantendremos informado sobre nuestro progreso
-   **Resolución:** Nuestro objetivo es lanzar una solución dentro de **7-14 días** para vulnerabilidades críticas
-   **Crédito:** Te acreditaremos en nuestro CHANGELOG y notas de lanzamiento (a menos que prefieras permanecer anónimo)

## Consideraciones de Seguridad

### Protección contra Path Traversal

Patto CLI implementa múltiples capas de protección contra ataques de path traversal:

```typescript
function sanitizePath(inputPath: string): string {
    // Filtra '..' y '.' para prevenir recorrido de directorios
    const parts = inputPath
        .split('/')
        .filter((part) => part !== '..' && part !== '.' && part !== '');
    return parts.join('/');
}
```

Todas las entradas de usuario para rutas de archivos son sanitizadas antes de su uso.

### Validación de Entrada

Todos los nombres de comandos y opciones son validados:

-   **Validación de kebab-case:** Solo letras minúsculas, números y guiones
-   **Sin espacios ni caracteres especiales:** Previene inyección de comandos
-   **Sin unicode/acentos:** Asegura compatibilidad entre sistemas

```typescript
function validateKebabCase(value: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
}
```

### Operaciones del Sistema de Archivos

-   **Creación recursiva de directorios:** Usa `fs.mkdirSync` de Node.js con `recursive: true`
-   **Verificación de existencia:** Siempre verifica si los archivos existen antes de sobrescribir
-   **Operaciones delimitadas:** Todas las operaciones están delimitadas al directorio de trabajo actual

### Dependencias

Actualizamos regularmente nuestras dependencias para parchear vulnerabilidades conocidas:

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias
npm update

# Corregir vulnerabilidades automáticamente
npm audit fix
```

## Medidas de Seguridad Conocidas

### 1. Prevención de Inyección de Templates

Los templates usan reemplazo simple de cadenas con nombres de variables específicos:

-   `{{commandName}}`
-   `{{name}}`
-   `{{description}}`
-   `{{class}}`
-   `{{scope}}`
-   `{{folder}}`

No es posible ninguna ejecución arbitraria de código a través de los templates.

### 2. Operaciones de Git

Las operaciones de git usan `execSync` con:

-   **Modo silencioso:** `stdio: 'ignore'` previene fuga de información
-   **Comandos específicos:** Solo se usan `git clone` y `git init`
-   **Sin entrada de usuario en comandos git:** La URL del repositorio está hardcodeada

### 3. Registro de Plugins

El registro de plugins modifica `plugins.config.ts`:

-   **Prevención de duplicados:** Verifica si el import ya existe
-   **Inserción segura:** Usa operaciones de cadenas, no `eval()` ni ejecución dinámica de código
-   **Validación:** Todos los nombres de plugins son validados antes del registro

## Mejores Prácticas para Usuarios

### 1. Verificar Autenticidad del Paquete

Siempre instala desde el registro oficial de npm:

```bash
npm install -g patto-cli
```

Verifica el paquete:

```bash
npm info patto-cli
# Verifica: publisher, repository, version
```

### 2. Mantén Actualizado

Actualiza regularmente para obtener parches de seguridad:

```bash
npm update -g patto-cli
```

### 3. Revisa el Código Generado

Siempre revisa el código generado antes de hacer commit:

```bash
git diff
```

### 4. Usa en Entornos Confiables

Ejecuta Patto CLI solo en:

-   ✅ Tu máquina de desarrollo local
-   ✅ Pipelines CI/CD confiables
-   ❌ Servidores de producción
-   ❌ Entornos no confiables

### 5. Permisos

Patto CLI requiere:

-   **Acceso al sistema de archivos:** Para crear y modificar archivos
-   **Acceso a la red:** Para clonar el repositorio del template (solo durante `init`)
-   **Sin privilegios elevados:** Nunca ejecutes con `sudo`

## Política de Divulgación de Vulnerabilidades

### Niveles de Severidad

**Crítico** (CVSS 9.0-10.0)

-   Ejecución remota de código
-   Bypass de autenticación
-   Escalada de privilegios

**Alto** (CVSS 7.0-8.9)

-   Inyección SQL (si aplica)
-   XSS (si aplica)
-   Exposición de datos sensibles

**Medio** (CVSS 4.0-6.9)

-   Vulnerabilidades CSRF
-   Denegación de servicio
-   Divulgación de información

**Bajo** (CVSS 0.1-3.9)

-   Fugas menores de información
-   Ataques teóricos

### Cronograma de Respuesta

| Severidad | Confirmación | Evaluación Inicial | Lanzamiento de Solución |
| --------- | ------------ | ------------------ | ----------------------- |
| Crítico   | 24 horas     | 48 horas           | 7 días                  |
| Alto      | 48 horas     | 5 días             | 14 días                 |
| Medio     | 7 días       | 14 días            | 30 días                 |
| Bajo      | 14 días      | 30 días            | 90 días                 |

## Actualizaciones de Seguridad

Las actualizaciones de seguridad se lanzarán como:

1. **Versión de parche** para correcciones de severidad crítica/alta
2. **Documentadas en CHANGELOG.md** con prefijo `[SEGURIDAD]`
3. **GitHub Security Advisory** para vulnerabilidades críticas
4. **Avisos de seguridad de npm** cuando sea aplicable

## Salón de la Fama de Seguridad

Reconoceremos a los investigadores de seguridad que divulguen vulnerabilidades responsablemente:

<!-- No se han reportado vulnerabilidades aún -->

---

**Última Actualización:** 14 de Noviembre de 2025  
**Versión de la Política:** 1.0

¡Gracias por ayudar a mantener seguros a Patto CLI y sus usuarios! 🔒
