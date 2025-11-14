# Registro de Cambios

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [0.0.1] - 2025-11-14

### 🎉 Lanzamiento Inicial

Primera versión de Patto CLI - Una herramienta CLI potente para generar código estructurado de Discord bots.

### ✨ Agregado

#### Comandos Core

-   **`patto init`**: Inicializa un nuevo proyecto de bot de Discord

    -   Clona repositorio de template
    -   Configura estructura básica del proyecto
    -   Instala dependencias automáticamente
    -   Configura git si no está inicializado

-   **`patto generate` (alias: `g`)**: Comando principal de generación con 4 subcomandos

#### Generadores de Comandos

-   **`patto g command <nombre>` (alias: `g g c`)**: Genera comandos de Discord

    -   ✅ Soporte para comandos simples y anidados con carpetas (ej: `music/play`)
    -   ✅ Modo unificado: Crea un solo archivo con toda la lógica
    -   ✅ Modo dividido: Crea archivos separados para data, execute y autocomplete
    -   ✅ Opción `--description`: Agrega descripción personalizada del comando
    -   ✅ Validación kebab-case para nombres de comandos
    -   ✅ Sanitización automática de rutas para prevenir path traversal
    -   ✅ Generación de templates con clases extendidas de `SlashCommand`

-   **`patto g subcommand <parent/nombre>` (alias: `g g s`)**: Genera subcomandos

    -   ✅ Nomenclatura: `{parent}-{nombre}.command.ts` → clase `ParentNombreCommand`
    -   ✅ Validación de existencia del comando padre
    -   ✅ Hereda de `SlashSubcommand`
    -   ✅ Soporte para opciones `--description`

-   **`patto g subcommand-group <parent/subcommand/nombre>` (alias: `g g g`)**: Genera grupos de subcomandos

    -   ✅ Nomenclatura: `{parent}-{subcommand}-{nombre}.command.ts` → clase `ParentSubcommandNombreCommand`
    -   ✅ Validación de existencia del comando padre y subcomando
    -   ✅ Permite anidamiento de 3 niveles (límite de Discord)
    -   ✅ Hereda de `SlashSubcommand`

-   **`patto g plugin <nombre>` (alias: `g g p`)**: Genera plugins con registro automático
    -   ✅ Tres modos de scope:
        -   `Specified`: Usa lista explícita de comandos
        -   `Folder`: Carga comandos de una carpeta específica
        -   `DeepFolder`: Carga comandos recursivamente de carpetas
    -   ✅ **Auto-registro en `src/config/plugins.config.ts`**:
        -   Agrega import automáticamente al inicio del archivo
        -   Agrega código de registro al final del archivo
        -   Previene duplicados verificando imports existentes
    -   ✅ Plantilla completa con métodos `before()`, `after()` y `error()`
    -   ✅ Hereda de `Plugin`

#### Funcionalidades de Desarrollo

-   **Validación de nombres**: Todas las entradas son validadas contra formato kebab-case
-   **Prevención de duplicados**: Verifica que los archivos no existan antes de crearlos
-   **Sanitización de rutas**: Protege contra ataques de path traversal
-   **Creación recursiva de carpetas**: Crea automáticamente carpetas faltantes
-   **Mensajes informativos coloreados**: Usa chalk para feedback visual claro
-   **Aliases**: Todos los comandos tienen aliases cortos para acceso rápido

#### Testing

-   ✅ **30 tests** con 100% de éxito usando Vitest
-   ✅ Suite de tests modular en `tests/generate/`:
    -   `command.test.ts`: 10 tests para generación de comandos
    -   `subcommand.test.ts`: 5 tests para generación de subcomandos
    -   `subcommand-group.test.ts`: 6 tests para generación de grupos
    -   `plugin.test.ts`: 9 tests para generación de plugins
-   ✅ Tests aislados con directorios de prueba separados
-   ✅ Cobertura de:
    -   Generación de archivos
    -   Validación de nombres
    -   Detección de duplicados
    -   Verificación de contenido de archivos
    -   Auto-registro de plugins

#### Documentación

-   ✅ **README.md** completo con:
    -   Badges de estado (licencia, tests)
    -   Guía de instalación
    -   Ejemplos de uso para todos los comandos
    -   Tabla de características
    -   Estructura del proyecto
    -   Documentación de comandos detallada
    -   Roadmap de funcionalidades futuras
-   ✅ **SECURITY.md**: Política de seguridad completa
    -   Proceso de reporte de vulnerabilidades
    -   Consideraciones de seguridad (path traversal, inyección)
    -   Mejores prácticas para usuarios
    -   Cronograma de respuesta por severidad
-   ✅ **CODE_OF_CONDUCT.md**: Código de conducta basado en Contributor Covenant 2.1
    -   Estándares de comportamiento
    -   Proceso de aplicación
    -   Compromiso con la diversidad e inclusión
-   ✅ **CONTRIBUTING.md**: Guía completa de contribución
    -   Setup del entorno de desarrollo
    -   Estructura del proyecto explicada
    -   Guidelines de código, testing y commits
    -   Proceso de Pull Request
-   ✅ **CHANGELOG.md**: Este archivo

#### Arquitectura

-   **Estructura Modular**: Código organizado en archivos separados
    -   `src/commands/generate/command.ts`: Lógica de generación de comandos
    -   `src/commands/generate/subcommand.ts`: Lógica de generación de subcomandos
    -   `src/commands/generate/subcommand-group.ts`: Lógica de generación de grupos
    -   `src/commands/generate/plugin.ts`: Lógica de generación de plugins
    -   `src/commands/generate.ts`: Orquestador principal (12 líneas)
-   **Separación de responsabilidades**: Cada generador es independiente
-   **Reutilización de código**: Funciones compartidas en utils
-   **Mantenibilidad**: Código limpio y bien documentado

### 🛠️ Técnico

#### Stack de Tecnologías

-   **Runtime**: Node.js v18.0.0+
-   **Lenguaje**: TypeScript con ES Modules
-   **CLI Framework**: Commander.js v14.0.2
-   **Testing**: Vitest v2.1.8
-   **Styling**: chalk v5.6.2
-   **File System**: Node.js fs/promises

#### Configuración

-   **TypeScript**: Configuración moderna con ES2022
-   **Package Type**: ES Module
-   **Bin Entry**: `patto` global command
-   **Engines**: Node.js >=18.0.0

#### Dependencias

**Dependencias de Producción**:

```json
{
    "chalk": "^5.6.2",
    "commander": "^14.0.2"
}
```

**Dependencias de Desarrollo**:

```json
{
    "@types/node": "^22.10.1",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
}
```

### 📦 Distribución

-   **Nombre del paquete**: `patto-cli`
-   **Versión**: 0.0.1
-   **Licencia**: MIT
-   **Repositorio**: https://github.com/HormigaDev/patto-cli
-   **Autor**: HormigaDev (hormigadev7@gmail.com)
-   **Instalación**: `npm install -g patto-cli`

### 🎯 Características Destacadas

1. **Auto-registro de Plugins**: Los plugins se registran automáticamente en el archivo de configuración
2. **Validación Robusta**: Validación integral de nombres y rutas
3. **Seguridad**: Protección contra path traversal y inyección
4. **Tests Completos**: 30 tests que garantizan la calidad
5. **Documentación Exhaustiva**: Documentación completa en español
6. **Estructura Modular**: Código limpio y mantenible
7. **CLI Intuitiva**: Comandos fáciles de usar con aliases
8. **Feedback Visual**: Mensajes coloreados informativos

### 🐛 Conocido

-   Ninguno reportado en esta versión

### 🔒 Seguridad

-   Implementación de sanitización de rutas contra path traversal
-   Validación de entradas contra inyección de comandos
-   Sin uso de `eval()` o ejecución dinámica de código
-   Operaciones delimitadas al directorio de trabajo

---

## Tipo de Cambios

Este proyecto usa las siguientes categorías para documentar cambios:

-   **Agregado** (`✨ Added`): Para funcionalidades nuevas
-   **Cambiado** (`🔄 Changed`): Para cambios en funcionalidades existentes
-   **Deprecado** (`⚠️ Deprecated`): Para funcionalidades que serán removidas pronto
-   **Removido** (`🗑️ Removed`): Para funcionalidades removidas
-   **Corregido** (`🐛 Fixed`): Para correcciones de bugs
-   **Seguridad** (`🔒 Security`): Para parches de seguridad

## Enlaces

-   [Repositorio](https://github.com/HormigaDev/patto-cli)
-   [Issues](https://github.com/HormigaDev/patto-cli/issues)
-   [Pull Requests](https://github.com/HormigaDev/patto-cli/pulls)
-   [Releases](https://github.com/HormigaDev/patto-cli/releases)

---

**Formato**: [Keep a Changelog](https://keepachangelog.com/es/1.0.0/)  
**Versionado**: [Semantic Versioning](https://semver.org/lang/es/)  
**Última Actualización**: 14 de Noviembre de 2025
