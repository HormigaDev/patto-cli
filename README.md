<img src="./assets/patto-cli-banner.png" alt="Patto CLI Banner">

# Patto CLI

[![npm version](https://img.shields.io/npm/v/patto-cli?logo=npm)](https://www.npmjs.com/package/patto-cli)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-30%20pasando-brightgreen.svg)](https://github.com/HormigaDev/patto-cli)

Herramienta de línea de comandos para trabajar con [Patto Bot Template](https://github.com/pattobotplus/bot-template). Facilita la inicialización de proyectos y la generación de comandos, subcomandos, grupos y plugins para tu bot de Discord.

## 📋 Tabla de Contenidos

-   [Características](#-características)
-   [Instalación](#-instalación)
-   [Comandos Disponibles](#-comandos-disponibles)
    -   [init](#init---inicializar-proyecto)
    -   [generate](#generate---generar-código)
-   [Ejemplos de Uso](#-ejemplos-de-uso)
-   [Estructura del Proyecto](#-estructura-del-proyecto)
-   [Testing](#-testing)
-   [Contribuir](#-contribuir)
-   [Licencia](#-licencia)

## ✨ Características

-   🚀 **Inicialización rápida**: Crea proyectos nuevos desde el template oficial
-   🎨 **Generación de código**: Crea comandos, subcomandos, grupos y plugins automáticamente
-   ✅ **Validaciones integradas**: Nombres en kebab-case, prevención de path traversal
-   📦 **Modular**: Arquitectura limpia y fácil de mantener
-   🧪 **Testeado**: 30+ tests cubriendo toda la funcionalidad
-   🎯 **TypeScript**: Desarrollado completamente en TypeScript
-   🔧 **Flexible**: Opciones para archivos unificados o separados

## 📦 Instalación

### Global (Recomendado)

```bash
npm install -g patto-cli
```

### Local (Desarrollo)

```bash
npm install --save-dev patto-cli
```

### Uso directo con npx

```bash
npx patto-cli <comando>
```

## 🎯 Comandos Disponibles

### `init` - Inicializar Proyecto

Crea un nuevo proyecto de Patto Bot desde el template oficial.

```bash
patto init [nombre-proyecto]
```

**Opciones:**

-   `nombre-proyecto`: Nombre del proyecto (opcional, se pedirá interactivamente)

**Características:**

-   ✓ Preserva mayúsculas/minúsculas en nombres de carpeta
-   ✓ Convierte a kebab-case para package.json
-   ✓ Clona el repositorio oficial
-   ✓ Instala dependencias automáticamente
-   ✓ Operaciones git silenciosas

**Ejemplo:**

```bash
patto init MiBot
# Crea: ./MiBot/
# package.json name: "mi-bot"
```

### `generate` - Generar Código

Genera comandos, subcomandos, grupos de subcomandos o plugins automáticamente.

#### Subcomandos disponibles:

-   [`command`](#command---generar-comando) (alias: `c`)
-   [`subcommand`](#subcommand---generar-subcomando) (alias: `s`)
-   [`subcommand-group`](#subcommand-group---generar-grupo) (alias: `g`)
-   [`plugin`](#plugin---generar-plugin) (alias: `p`)

---

#### `command` - Generar Comando

Genera un comando básico para el bot.

```bash
patto generate command -n <name> [opciones]
# o usando alias
patto g c -n <name> [opciones]
```

**Opciones:**

-   `-n, --name <name>`: Nombre del comando (kebab-case) **[requerido]**
-   `-u, --unified`: Crear archivo unificado (sin separar definition y command)
-   `-d, --description <text>`: Descripción del comando

**Ejemplos:**

```bash
# Comando básico con archivos separados
patto generate command -n ping

# Comando unificado con descripción
patto g c -n help -u -d "Muestra ayuda del bot"

# Comando en carpeta anidada
patto generate command -n utils/calculator
```

**Genera:**

```
src/
├── commands/
│   └── ping.command.ts          # Implementación
└── definitions/
    └── ping.definition.ts       # Decorador y definición
```

---

#### `subcommand` - Generar Subcomando

Genera un subcomando para un comando existente.

```bash
patto generate subcommand -n <name> -p <parent> [opciones]
# o usando alias
patto g s -n <name> -p <parent> [opciones]
```

**Opciones:**

-   `-n, --name <name>`: Nombre del subcomando (kebab-case) **[requerido]**
-   `-p, --parent <parent>`: Comando padre (kebab-case) **[requerido]**
-   `-u, --unified`: Crear archivo unificado
-   `-d, --description <text>`: Descripción del subcomando

**Ejemplos:**

```bash
# Subcomando básico
patto generate subcommand -n list -p user

# Con descripción
patto g s -n ban -p admin -d "Banea un usuario"
```

**Genera:**

```
src/
├── commands/
│   └── user-list.command.ts
└── definitions/
    └── user-list.definition.ts
```

**Nombre del archivo:** `{parent}-{name}.command.ts`  
**Clase:** `{Parent}{Name}Command`

---

#### `subcommand-group` - Generar Grupo

Genera un grupo de subcomandos (nivel 3 de anidación).

```bash
patto generate subcommand-group -n <name> -p <parent> -s <subcommand> [opciones]
# o usando alias
patto g g -n <name> -p <parent> -s <subcommand> [opciones]
```

**Opciones:**

-   `-n, --name <name>`: Nombre del grupo (kebab-case) **[requerido]**
-   `-p, --parent <parent>`: Comando padre (kebab-case) **[requerido]**
-   `-s, --subcommand <subcommand>`: Subcomando (kebab-case) **[requerido]**
-   `-u, --unified`: Crear archivo unificado
-   `-d, --description <text>`: Descripción del grupo

**Ejemplos:**

```bash
# Grupo de subcomandos
patto generate subcommand-group -n tools -p admin -s manage

# Con descripción
patto g g -n roles -p server -s config -d "Gestión de roles"
```

**Genera:**

```
src/
├── commands/
│   └── admin-manage-tools.command.ts
└── definitions/
    └── admin-manage-tools.definition.ts
```

**Nombre del archivo:** `{parent}-{subcommand}-{name}.command.ts`  
**Clase:** `{Parent}{Subcommand}{Name}Command`

---

#### `plugin` - Generar Plugin

Genera un plugin y lo registra automáticamente en `src/config/plugins.config.ts`.

```bash
patto generate plugin -n <name> [opciones]
# o usando alias
patto g p -n <name> [opciones]
```

**Opciones:**

-   `-n, --name <name>`: Nombre del plugin (kebab-case) **[requerido]**
-   `--folder <folder>`: Carpeta específica donde se aplicará (PluginScope.Folder)
-   `--global`: Aplicar a carpeta y subcarpetas (PluginScope.DeepFolder)

**Ejemplos:**

```bash
# Plugin básico (PluginScope.Specified)
patto generate plugin -n logger

# Plugin para carpeta específica
patto g p -n auth-check --folder commands

# Plugin global para carpeta y subcarpetas
patto generate plugin -n rate-limiter --global --folder api

# Plugin en subcarpeta
patto g p -n utils/validator
```

**Genera:**

```
src/
├── plugins/
│   └── logger.plugin.ts         # Clase del plugin
└── config/
    └── plugins.config.ts        # ← Actualizado automáticamente
```

**Registro automático:**
El comando agrega automáticamente:

1. Import del plugin al inicio del archivo
2. Código de registro al final del archivo

---

## 💡 Ejemplos de Uso

### Crear un bot completo desde cero

```bash
# 1. Inicializar proyecto
patto init MiSuperBot
cd MiSuperBot

# 2. Generar comandos básicos
patto g c -n ping -d "Verifica latencia del bot"
patto g c -n help -d "Muestra comandos disponibles"

# 3. Generar comando con subcomandos
patto g c -n user -d "Gestión de usuarios"
patto g s -n info -p user -d "Información de usuario"
patto g s -n avatar -p user -d "Avatar de usuario"

# 4. Generar comando admin con grupos
patto g c -n admin -d "Comandos administrativos"
patto g s -n manage -p admin -d "Gestión del servidor"
patto g g -n roles -p admin -s manage -d "Gestión de roles"
patto g g -n channels -p admin -s manage -d "Gestión de canales"

# 5. Generar plugins
patto g p -n auth-middleware --folder commands
patto g p -n logger --global
patto g p -n utils/validator
```

### Estructura resultante:

```
MiSuperBot/
├── src/
│   ├── commands/
│   │   ├── ping.command.ts
│   │   ├── help.command.ts
│   │   ├── user.command.ts
│   │   ├── user-info.command.ts
│   │   ├── user-avatar.command.ts
│   │   ├── admin.command.ts
│   │   ├── admin-manage.command.ts
│   │   ├── admin-manage-roles.command.ts
│   │   └── admin-manage-channels.command.ts
│   ├── definitions/
│   │   └── [archivos .definition.ts correspondientes]
│   ├── plugins/
│   │   ├── auth-middleware.plugin.ts
│   │   ├── logger.plugin.ts
│   │   └── utils/
│   │       └── validator.plugin.ts
│   └── config/
│       └── plugins.config.ts
└── package.json
```

## 📁 Estructura del Proyecto

```
patto-cli/
├── src/
│   ├── commands/
│   │   ├── generate/              # Comandos de generación modulares
│   │   │   ├── command.ts         # Generador de comandos
│   │   │   ├── subcommand.ts      # Generador de subcomandos
│   │   │   ├── subcommand-group.ts # Generador de grupos
│   │   │   ├── plugin.ts          # Generador de plugins
│   │   │   └── README.md          # Documentación
│   │   ├── generate.ts            # Orquestador principal
│   │   └── init.ts                # Comando de inicialización
│   ├── templates/
│   │   ├── command.decorator.template
│   │   ├── subcommand.decorator.template
│   │   ├── subcommand.group.decorator.template
│   │   └── plugins/
│   │       ├── plugin.template
│   │       └── register-plugin.template
│   ├── types.ts                   # Tipos TypeScript
│   ├── utils.ts                   # Utilidades
│   ├── loader.ts                  # Cargador de comandos
│   └── index.ts                   # Entry point
├── tests/
│   └── generate/                  # Tests modulares
│       ├── command.test.ts
│       ├── subcommand.test.ts
│       ├── subcommand-group.test.ts
│       ├── plugin.test.ts
│       └── README.md
├── dist/                          # Archivos compilados
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

El proyecto cuenta con una suite completa de tests utilizando [Vitest](https://vitest.dev/).

### Ejecutar tests

```bash
# Todos los tests
npm test

# Tests específicos
npm test command.test.ts
npm test subcommand.test.ts
npm test subcommand-group.test.ts
npm test plugin.test.ts

# Watch mode
npm test -- --watch
```

### Cobertura de tests

-   **Total:** 30 tests
-   **Command:** 10 tests
-   **Subcommand:** 5 tests
-   **Subcommand Group:** 6 tests
-   **Plugin:** 9 tests

**Todos los tests están pasando** ✅

### Qué se testea

-   ✅ Creación correcta de archivos
-   ✅ Contenido generado
-   ✅ Validaciones de nombres (kebab-case)
-   ✅ Prevención de path traversal
-   ✅ Manejo de archivos duplicados
-   ✅ Funcionamiento de aliases
-   ✅ Registro automático de plugins
-   ✅ Opciones de comandos

## 🔒 Validaciones

Patto CLI incluye validaciones estrictas para garantizar la calidad del código generado:

### Nombres en kebab-case

```bash
✅ patto g c -n my-command       # Correcto
❌ patto g c -n MyCommand        # Error: debe ser kebab-case
❌ patto g c -n my_command       # Error: solo guiones permitidos
❌ patto g c -n "my command"     # Error: sin espacios
```

### Prevención de path traversal

```bash
✅ patto g c -n utils/helper     # Correcto: subcarpeta válida
❌ patto g c -n ../../../hack    # Protegido: se sanitiza automáticamente
```

### Archivos duplicados

```bash
✅ patto g c -n new-command      # Correcto: archivo no existe
❌ patto g c -n new-command      # Error: archivo ya existe
```

## 🎨 Convenciones de Código

### Nombres de archivos

-   **Comandos:** `{name}.command.ts` (kebab-case)
-   **Definiciones:** `{name}.definition.ts` (kebab-case)
-   **Plugins:** `{name}.plugin.ts` (kebab-case)

### Nombres de clases

-   **Comandos:** `{Name}Command` (PascalCase)
-   **Definiciones:** `{Name}Definition` (PascalCase)
-   **Plugins:** `{Name}Plugin` (PascalCase)

### Imports

-   **Comandos:** `@/commands/`
-   **Definiciones:** `@/definitions/`
-   **Plugins:** `@/plugins/`

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md) antes de enviar un Pull Request.

### Proceso de contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/HormigaDev/patto-cli.git
cd patto-cli

# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Compilar
npm run build

# Ejecutar en modo desarrollo
npm start init MiBot
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**HormigaDev**

-   Email: hormigadev7@gmail.com
-   GitHub: [@HormigaDev](https://github.com/HormigaDev)

## 🔗 Enlaces

-   [Patto Bot Template](https://github.com/HormigaDev/patto-bot-template)
-   [Documentación del Template](https://github.com/HormigaDev/patto-bot-template#readme)
-   [Reportar un Bug](https://github.com/HormigaDev/patto-cli/issues)
-   [Solicitar una Feature](https://github.com/HormigaDev/patto-cli/issues)

## 🙏 Agradecimientos

-   A todos los [contribuidores](https://github.com/HormigaDev/patto-cli/graphs/contributors) del proyecto
-   A la comunidad de Discord.js

---

**¿Te gusta Patto CLI?** ⭐ Dale una estrella en [GitHub](https://github.com/HormigaDev/patto-cli)!
