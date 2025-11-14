# Comando Generate - Estructura Modular

Este directorio contiene los subcomandos del comando `generate`, organizados en archivos separados para mejor mantenibilidad.

## Estructura

```
generate/
├── README.md                 # Este archivo
├── command.ts                # Genera comandos básicos
├── subcommand.ts             # Genera subcomandos
├── subcommand-group.ts       # Genera grupos de subcomandos
└── plugin.ts                 # Genera plugins
```

## Archivos

### command.ts

Genera comandos básicos para el bot de Discord.

-   **Alias:** `c`
-   **Opciones:**
    -   `-n, --name <name>`: Nombre del comando (kebab-case)
    -   `-u, --unified`: Crear archivo unificado
    -   `-d, --description <description>`: Descripción del comando

**Ejemplo:**

```bash
patto-cli generate command -n my-command
patto-cli g c -n my-command -u -d "Mi comando personalizado"
```

### subcommand.ts

Genera subcomandos para comandos existentes.

-   **Alias:** `s`
-   **Opciones:**
    -   `-n, --name <name>`: Nombre del subcomando (kebab-case)
    -   `-p, --parent <parent>`: Comando padre (kebab-case)
    -   `-u, --unified`: Crear archivo unificado
    -   `-d, --description <description>`: Descripción del subcomando

**Ejemplo:**

```bash
patto-cli generate subcommand -n helper -p admin
patto-cli g s -n helper -p admin -u
```

### subcommand-group.ts

Genera grupos de subcomandos anidados.

-   **Alias:** `g`
-   **Opciones:**
    -   `-n, --name <name>`: Nombre del grupo (kebab-case)
    -   `-p, --parent <parent>`: Comando padre (kebab-case)
    -   `-s, --subcommand <subcommand>`: Nombre del subcomando (kebab-case)
    -   `-u, --unified`: Crear archivo unificado
    -   `-d, --description <description>`: Descripción del grupo

**Ejemplo:**

```bash
patto-cli generate subcommand-group -n tools -p admin -s manage
patto-cli g g -n tools -p admin -s manage -u
```

### plugin.ts

Genera plugins para el sistema de bot y **automáticamente** registra el plugin en `@/config/plugins.config.ts`.

-   **Alias:** `p`
-   **Opciones:**
    -   `-n, --name <name>`: Nombre del plugin (kebab-case)
    -   `--global`: Aplicar a carpeta y subcarpetas (PluginScope.DeepFolder)
    -   `--folder <folder>`: Carpeta específica (PluginScope.Folder)

**Ejemplo:**

```bash
patto-cli generate plugin -n my-plugin
patto-cli g p -n my-plugin --folder commands
patto-cli g p -n my-plugin --global --folder commands
```

**Nota:** El comando generará el archivo del plugin y **automáticamente** agregará:

-   El import al inicio de `@/config/plugins.config.ts`
-   El código de registro al final de `@/config/plugins.config.ts`

## Orquestador

El archivo principal `generate.ts` en el directorio padre actúa como orquestador, importando y registrando todos los subcomandos:

```typescript
import { Command } from 'commander';
import { commandSubcommand } from './generate/command.js';
import { subcommandSubcommand } from './generate/subcommand.js';
import { groupSubcommand } from './generate/subcommand-group.js';
import { pluginSubcommand } from './generate/plugin.js';

export const generateCommand = new Command('generate')
    .alias('g')
    .description('Genera comandos, subcomandos, grupos o plugins para tu bot de Discord')
    .addCommand(commandSubcommand)
    .addCommand(subcommandSubcommand)
    .addCommand(groupSubcommand)
    .addCommand(pluginSubcommand);
```

## Funciones Compartidas

Cada archivo contiene implementaciones similares de las siguientes funciones utilitarias:

-   `sanitizePath()`: Elimina path traversal injection (..)
-   `validateKebabCase()`: Valida formato kebab-case
-   `parseCommandName()` / `parseSubcommandName()` / `parseGroupName()`: Parseo de nombres
-   `getDecoratorTemplate()`: Obtiene plantilla de decorador
-   `getDecoratorImport()`: Obtiene import de decorador
-   `replaceTemplateVariables()`: Reemplazo de variables en templates
-   `createUnifiedFile()`: Crea archivo unificado
-   `createSplitFiles()`: Crea archivos separados (definition + command)

## Convenciones de Nombres

-   **Archivos:** kebab-case con sufijos `.command.ts`, `.definition.ts`, `.plugin.ts`
-   **Clases:** PascalCase con sufijos `Command`, `Definition`, `Plugin`
-   **Subcomandos:** `parent-name.command.ts` → `ParentNameCommand`
-   **Grupos:** `parent-subcommand-name.command.ts` → `ParentSubcommandNameCommand`

## Paths de Import

-   Comandos: `@/commands/`
-   Definiciones: `@/definitions/`
-   Plugins: `@/plugins/`

## Validaciones

Todos los subcomandos validan:

-   ✓ Nombres en kebab-case
-   ✓ Sin espacios ni acentos
-   ✓ Prevención de path traversal
-   ✓ Existencia de archivos
-   ✓ Parámetros requeridos

## Tests

Los tests se encuentran en `tests/generate.test.ts` y cubren:

-   Comandos simples
-   Subcomandos
-   Grupos de subcomandos
-   Validaciones
-   Aliases
-   Path traversal prevention

Para ejecutar los tests:

```bash
npm test
```
