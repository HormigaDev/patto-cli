# Tests de Generate - Estructura Modular

Este directorio contiene los tests para los comandos de generación, organizados en archivos separados para mejor mantenibilidad.

## Estructura

```
tests/generate/
├── README.md                 # Este archivo
├── command.test.ts           # Tests para comandos
├── subcommand.test.ts        # Tests para subcomandos
├── subcommand-group.test.ts  # Tests para grupos
└── plugin.test.ts            # Tests para plugins
```

## Archivos de Test

### command.test.ts (10 tests)

-   ✓ debería crear un comando con archivos separados
-   ✓ debería crear un comando unificado
-   ✓ debería crear comando con descripción
-   ✓ debería crear comando en carpeta anidada
-   ✓ debería fallar si el nombre no es kebab-case
-   ✓ debería fallar si el nombre tiene espacios
-   ✓ debería fallar si el nombre tiene acentos
-   ✓ debería fallar si el archivo ya existe
-   ✓ debería prevenir path traversal
-   ✓ debería funcionar con alias "c"

### subcommand.test.ts (5 tests)

-   ✓ debería crear un subcomando con archivos separados
-   ✓ debería crear un subcomando unificado
-   ✓ debería fallar si no se proporciona parent
-   ✓ debería fallar si el parent no es kebab-case
-   ✓ debería funcionar con alias "s"

### subcommand-group.test.ts (6 tests)

-   ✓ debería crear un grupo de subcomandos con archivos separados
-   ✓ debería crear un grupo unificado
-   ✓ debería fallar si no se proporciona parent
-   ✓ debería fallar si no se proporciona subcommand
-   ✓ debería fallar si el subcommand no es kebab-case
-   ✓ debería funcionar con alias "g"

### plugin.test.ts (9 tests)

-   ✓ debería crear un plugin básico
-   ✓ debería crear plugin con scope Folder
-   ✓ debería crear plugin con scope DeepFolder
-   ✓ debería crear plugin en carpeta anidada
-   ✓ debería fallar si el nombre del plugin no es kebab-case
-   ✓ debería fallar si el plugin ya existe
-   ✓ debería fallar si el nombre de la carpeta no es kebab-case
-   ✓ debería agregar múltiples plugins sin duplicar imports
-   ✓ debería funcionar con alias "p"

## Características de los Tests

### Directorios de Test Aislados

Cada suite de tests usa su propio directorio temporal:

-   `test-project-command/` para tests de comandos
-   `test-project-subcommand/` para tests de subcomandos
-   `test-project-group/` para tests de grupos
-   `test-project-plugin/` para tests de plugins

Esto evita conflictos entre tests que se ejecutan en paralelo.

### Setup y Cleanup

Cada archivo de test:

-   Crea el directorio temporal en `beforeEach()`
-   Limpia el directorio temporal en `afterEach()`
-   Crea las estructuras de carpetas necesarias (`src/commands/`, `src/definitions/`, etc.)

### Validaciones Cubiertas

-   ✅ Creación de archivos correcta
-   ✅ Contenido de archivos generados
-   ✅ Imports correctos
-   ✅ Nombres de clases en PascalCase
-   ✅ Validación de kebab-case
-   ✅ Prevención de path traversal
-   ✅ Manejo de archivos existentes
-   ✅ Funcionamiento de aliases
-   ✅ Opciones de comandos (unified, description, etc.)
-   ✅ Registro automático de plugins

## Ejecutar Tests

### Todos los tests

```bash
npm test
```

### Tests específicos

```bash
npm test command.test.ts
npm test subcommand.test.ts
npm test subcommand-group.test.ts
npm test plugin.test.ts
```

### Watch mode

```bash
npm test -- --watch
```

## Cobertura

**Total:** 30 tests

-   Command: 10 tests
-   Subcommand: 5 tests
-   Subcommand Group: 6 tests
-   Plugin: 9 tests

**Estado:** ✅ 30/30 passing
