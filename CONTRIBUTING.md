# Guía de Contribución

¡Gracias por tu interés en contribuir a Patto CLI! 🎉

Esta guía te ayudará a empezar con el desarrollo y a entender nuestro proceso de contribución.

## 📋 Tabla de Contenidos

-   [Código de Conducta](#código-de-conducta)
-   [Cómo Puedo Contribuir](#cómo-puedo-contribuir)
-   [Setup del Entorno de Desarrollo](#setup-del-entorno-de-desarrollo)
-   [Estructura del Proyecto](#estructura-del-proyecto)
-   [Guidelines de Desarrollo](#guidelines-de-desarrollo)
-   [Proceso de Pull Request](#proceso-de-pull-request)
-   [Estándares de Código](#estándares-de-código)
-   [Testing](#testing)
-   [Documentación](#documentación)
-   [Comunicación](#comunicación)

## Código de Conducta

Este proyecto y todos los que participen en él están regidos por el [Código de Conducta de Patto CLI](CODE_OF_CONDUCT.md). Al participar, se espera que mantengas este código. Por favor reporta comportamiento inaceptable a **hormigadev7@gmail.com**.

## Cómo Puedo Contribuir

### 🐛 Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

**Título**: Descripción breve y clara del problema

**Descripción del Bug**:

-   ¿Qué pasó?
-   ¿Qué esperabas que pasara?
-   ¿Cómo puedo reproducir el problema?

**Información del Entorno**:

```
- OS: [ej. Ubuntu 22.04, Windows 11, macOS 14]
- Node.js: [ej. v20.10.0]
- Patto CLI: [ej. v0.0.1]
```

**Pasos para Reproducir**:

1. Ejecuta `patto ...`
2. Observa el error en ...
3. Verifica que ...

**Comportamiento Esperado**:
Una descripción clara de lo que esperabas que sucediera.

**Screenshots** (si aplica):
Agrega screenshots para ayudar a explicar el problema.

**Contexto Adicional**:
Cualquier otra información sobre el problema.

### ✨ Sugerir Mejoras

Las sugerencias de mejoras son bienvenidas. Por favor crea un issue con:

**Título**: Descripción breve de la mejora

**¿Es tu solicitud de funcionalidad relacionada a un problema?**
Ej: "Siempre me frustra cuando [...]"

**Describe la solución que te gustaría**
Una descripción clara de lo que quieres que suceda.

**Describe alternativas que hayas considerado**
Una descripción de cualquier solución o funcionalidad alternativa.

**Contexto adicional**
Cualquier otra información o screenshots sobre la solicitud.

### 🔨 Tu Primer Pull Request

¿No estás seguro por dónde empezar? Busca issues etiquetados con:

-   `good first issue`: Issues buenos para principiantes
-   `help wanted`: Issues que necesitan ayuda
-   `bug`: Correcciones de bugs
-   `enhancement`: Nuevas funcionalidades

## Setup del Entorno de Desarrollo

### Prerrequisitos

-   **Node.js**: v18.0.0 o superior
-   **npm**: v9.0.0 o superior
-   **Git**: Cualquier versión reciente
-   **Editor**: VS Code recomendado (con extensión ESLint si aplica)

### Pasos de Instalación

1. **Fork el repositorio**

    ```bash
    # Visita https://github.com/HormigaDev/patto-cli
    # Haz clic en "Fork" en la esquina superior derecha
    ```

2. **Clona tu fork**

    ```bash
    git clone https://github.com/TU-USUARIO/patto-cli.git
    cd patto-cli
    ```

3. **Agrega el repositorio upstream**

    ```bash
    git remote add upstream https://github.com/HormigaDev/patto-cli.git
    ```

4. **Instala las dependencias**

    ```bash
    npm install
    ```

5. **Compila el proyecto**

    ```bash
    npm run build
    ```

6. **Enlaza el CLI localmente**

    ```bash
    npm link
    ```

    Ahora puedes usar `patto` en tu terminal para probar tus cambios.

7. **Verifica la instalación**
    ```bash
    patto --version
    # Debería mostrar: 0.0.1
    ```

### Desarrollo en Tiempo Real

Para trabajar con recarga automática:

```bash
# En una terminal, compila en modo watch
npm run build -- --watch

# En otra terminal, prueba tus cambios
patto g command test
```

## Estructura del Proyecto

```
patto-cli/
├── src/
│   ├── commands/
│   │   ├── generate/
│   │   │   ├── command.ts          # Generador de comandos
│   │   │   ├── subcommand.ts       # Generador de subcomandos
│   │   │   ├── subcommand-group.ts # Generador de grupos
│   │   │   ├── plugin.ts           # Generador de plugins
│   │   │   └── README.md           # Docs de los generadores
│   │   ├── generate.ts             # Orquestador principal
│   │   └── init.ts                 # Comando init
│   ├── index.ts                    # Entry point del CLI
│   ├── loader.ts                   # Loader para comandos
│   ├── types.ts                    # Definiciones de tipos
│   └── utils.ts                    # Funciones de utilidad
├── tests/
│   └── generate/
│       ├── command.test.ts         # Tests de comandos
│       ├── subcommand.test.ts      # Tests de subcomandos
│       ├── subcommand-group.test.ts # Tests de grupos
│       ├── plugin.test.ts          # Tests de plugins
│       └── README.md               # Docs de los tests
├── dist/                           # Código compilado (gitignored)
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración de TypeScript
├── README.md                       # Documentación principal
├── CHANGELOG.md                    # Registro de cambios
├── CONTRIBUTING.md                 # Este archivo
├── CODE_OF_CONDUCT.md              # Código de conducta
└── SECURITY.md                     # Política de seguridad
```

### Módulos Clave

#### `src/commands/generate/`

Contiene todos los generadores:

-   **command.ts**: Genera comandos slash de Discord

    -   Funciones principales: `handleGenerateCommand()`, `createUnifiedFile()`, `createSplitFiles()`
    -   Validación: `validateKebabCase()`, `sanitizePath()`
    -   Parsing: `parseCommandName()`

-   **subcommand.ts**: Genera subcomandos

    -   Funciones principales: `handleGenerateSubcommand()`, `parseSubcommandName()`
    -   Validación de existencia del comando padre

-   **subcommand-group.ts**: Genera grupos de subcomandos

    -   Funciones principales: `handleGenerateGroup()`, `parseGroupName()`
    -   Validación de padre y subcomando

-   **plugin.ts**: Genera plugins con auto-registro
    -   Funciones principales: `handleGeneratePlugin()`
    -   Auto-registro en `plugins.config.ts`

#### `src/index.ts`

Entry point del CLI que:

-   Configura Commander.js
-   Carga comandos dinámicamente
-   Maneja errores globales

#### `src/utils.ts`

Funciones de utilidad compartidas:

-   `sanitizePath()`: Previene path traversal
-   `validateKebabCase()`: Valida nombres
-   Otras helpers comunes

## Guidelines de Desarrollo

### Principios de Diseño

1. **Simplicidad**: Mantén el código simple y legible
2. **Modularidad**: Una función, una responsabilidad
3. **Seguridad**: Valida todas las entradas del usuario
4. **Testing**: Todo el código nuevo debe tener tests
5. **Documentación**: Documenta funciones públicas y lógica compleja

### Convenciones de Código

#### TypeScript

-   **Usa tipos explícitos** siempre que sea posible

    ```typescript
    // ✅ Correcto
    function calculateSum(a: number, b: number): number {
        return a + b;
    }

    // ❌ Incorrecto
    function calculateSum(a, b) {
        return a + b;
    }
    ```

-   **Usa interfaces para objetos complejos**

    ```typescript
    interface GenerateOptions {
        name: string;
        description?: string;
        split?: boolean;
    }
    ```

-   **Evita `any`**, usa `unknown` si no conoces el tipo

    ```typescript
    // ✅ Correcto
    function processData(data: unknown): void {
        if (typeof data === 'string') {
            // procesar
        }
    }

    // ❌ Incorrecto
    function processData(data: any): void {
        // ...
    }
    ```

#### Nomenclatura

-   **Variables y funciones**: camelCase

    ```typescript
    const userName = 'John';
    function getUserName(): string {}
    ```

-   **Clases e interfaces**: PascalCase

    ```typescript
    class CommandGenerator {}
    interface CommandOptions {}
    ```

-   **Constantes**: UPPER_SNAKE_CASE

    ```typescript
    const MAX_RETRY_ATTEMPTS = 3;
    const DEFAULT_TIMEOUT = 5000;
    ```

-   **Archivos**: kebab-case
    ```
    command-generator.ts
    user-utils.ts
    ```

#### Funciones

-   **Funciones pequeñas y enfocadas**

    ```typescript
    // ✅ Correcto: Función con una responsabilidad
    function validateName(name: string): boolean {
        return /^[a-z0-9-]+$/.test(name);
    }

    // ❌ Incorrecto: Función que hace demasiado
    function processCommand(name, options, files, config) {
        // validar, crear archivos, actualizar config...
    }
    ```

-   **Retorna temprano**

    ```typescript
    // ✅ Correcto
    function processUser(user: User | null): void {
        if (!user) return;
        if (!user.isActive) return;
        // procesar usuario activo
    }

    // ❌ Incorrecto
    function processUser(user: User | null): void {
        if (user) {
            if (user.isActive) {
                // procesar usuario activo
            }
        }
    }
    ```

#### Manejo de Errores

-   **Usa errores descriptivos**

    ```typescript
    // ✅ Correcto
    if (!fs.existsSync(parentPath)) {
        console.error(chalk.red(`❌ El comando padre '${parent}' no existe.`));
        console.log(
            chalk.yellow(`💡 Primero crea el comando padre con: patto g command ${parent}`),
        );
        process.exit(1);
    }

    // ❌ Incorrecto
    if (!fs.existsSync(parentPath)) {
        throw new Error('File not found');
    }
    ```

### Seguridad

#### Validación de Entradas

Todas las entradas del usuario deben ser validadas:

```typescript
// Valida formato kebab-case
function validateKebabCase(value: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
}

// Sanitiza rutas para prevenir path traversal
function sanitizePath(inputPath: string): string {
    const parts = inputPath
        .split('/')
        .filter((part) => part !== '..' && part !== '.' && part !== '');
    return parts.join('/');
}
```

#### Prevención de Path Traversal

```typescript
// ✅ Correcto: Sanitiza antes de usar
const safePath = sanitizePath(userInput);
const fullPath = path.join(baseDir, safePath);

// ❌ Incorrecto: Usa entrada directamente
const fullPath = path.join(baseDir, userInput); // ¡Peligroso!
```

## Testing

### Escribir Tests

Usamos **Vitest** para testing. Todos los tests están en `tests/`.

#### Estructura de un Test

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Command Generator', () => {
    const testDir = path.join(process.cwd(), 'test-commands-unique');

    beforeEach(() => {
        // Setup: Crea directorio de prueba
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    });

    afterEach(() => {
        // Cleanup: Elimina directorio de prueba
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should create a command file', () => {
        const commandName = 'test';
        const filePath = path.join(testDir, `${commandName}.command.ts`);

        // Genera el comando
        // Tu código aquí

        // Verifica que el archivo fue creado
        expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should include correct class name', () => {
        const commandName = 'test-command';
        const filePath = path.join(testDir, `${commandName}.command.ts`);

        // Genera el comando
        // Tu código aquí

        // Lee el contenido
        const content = fs.readFileSync(filePath, 'utf-8');

        // Verifica el nombre de la clase
        expect(content).toContain('class TestCommandCommand');
    });
});
```

#### Guidelines de Testing

1. **Aislamiento**: Cada test debe ser independiente
2. **Cleanup**: Siempre limpia después de los tests
3. **Nombres descriptivos**: Los nombres de tests deben ser claros
4. **Arrange-Act-Assert**: Sigue este patrón

    ```typescript
    it('should validate kebab-case', () => {
        // Arrange
        const validName = 'my-command';
        const invalidName = 'MyCommand';

        // Act
        const isValid = validateKebabCase(validName);
        const isInvalid = validateKebabCase(invalidName);

        // Assert
        expect(isValid).toBe(true);
        expect(isInvalid).toBe(false);
    });
    ```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con watch mode
npm run test:watch

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar tests específicos
npm test -- command.test.ts
```

### Cobertura de Código

Nuestro objetivo es mantener **>80% de cobertura**:

```bash
npm run test:coverage
```

Esto generará un reporte en `coverage/`.

## Proceso de Pull Request

### 1. Crea una Rama

```bash
# Actualiza tu fork
git checkout master
git pull upstream master

# Crea una rama para tu funcionalidad
git checkout -b feature/mi-nueva-funcionalidad

# O para una corrección de bug
git checkout -b fix/corregir-bug-xyz
```

### 2. Haz tus Cambios

-   Escribe código limpio y bien documentado
-   Agrega tests para tus cambios
-   Actualiza la documentación si es necesario
-   Sigue las convenciones de código

### 3. Commit tus Cambios

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/):

```bash
# Formato: <tipo>(<alcance>): <descripción> @issue/<número>

# Tipos:
# - feat: Nueva funcionalidad @issue/<número>
# - fix: Corrección de bug @issue/<número>
# - docs: Cambios en documentación @issue/<número>
# - style: Cambios de formato (sin cambios de código) @issue/<número>
# - refactor: Refactorización (sin cambios de funcionalidad) @issue/<número>
# - test: Agregar o modificar tests @issue/<número>
# - chore: Cambios en build o herramientas @issue/<número>

# Ejemplos:
git commit -m "feat(generate): agregar soporte para plugins @issue/42"
git commit -m "fix(command): corregir validación de nombres @issue/56"
git commit -m "docs(readme): actualizar ejemplos de uso @issue/78"
git commit -m "test(plugin): agregar tests para auto-registro @issue/90"
```

### 4. Push a tu Fork

```bash
git push origin feature/mi-nueva-funcionalidad
```

### 5. Crea un Pull Request

1. Ve a https://github.com/HormigaDev/patto-cli
2. Haz clic en "Pull Request"
3. Selecciona tu rama
4. Completa la plantilla de PR:

```markdown
## Descripción

Breve descripción de tus cambios

## Tipo de cambio

-   [ ] Bug fix (cambio que corrige un issue)
-   [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
-   [ ] Breaking change (corrección o funcionalidad que causaría que funcionalidad existente no funcione como se esperaba)
-   [ ] Documentación
-   [ ] Refactoring
-   [ ] Tests

## ¿Cómo ha sido probado?

Describe los tests que ejecutaste

## Checklist

-   [ ] Mi código sigue las convenciones de este proyecto
-   [ ] He revisado mi propio código
-   [ ] He comentado mi código, especialmente en áreas difíciles
-   [ ] He actualizado la documentación
-   [ ] Mis cambios no generan nuevas advertencias
-   [ ] He agregado tests que prueban que mi corrección es efectiva o que mi funcionalidad funciona
-   [ ] Los tests unitarios nuevos y existentes pasan localmente
-   [ ] He actualizado CHANGELOG.md
```

### 6. Code Review

-   Responde a los comentarios de revisión
-   Haz cambios solicitados
-   Mantén la discusión profesional y constructiva

### 7. Merge

Una vez aprobado, un mantenedor hará merge de tu PR. ¡Felicidades! 🎉

## Estándares de Código

### Linting

Configuraremos ESLint próximamente. Mientras tanto:

-   Usa TypeScript strict mode
-   Sigue las convenciones de este documento
-   Revisa manualmente tu código

### Formateo

Prettier está configurado en el archivo `.prettierrc`. Usa los siguientes ajustes:

-   Usa 4 espacios para indentación (como está configurado en tsconfig.json)
-   No uses tabs
-   Usa comillas simples para strings
-   Agrega punto y coma al final de las declaraciones

## Documentación

### JSDoc para Funciones Públicas

````typescript
/**
 * Valida que un nombre esté en formato kebab-case.
 *
 * @param value - El string a validar
 * @returns true si el valor es kebab-case válido, false de lo contrario
 *
 * @example
 * ```typescript
 * validateKebabCase('my-command') // true
 * validateKebabCase('MyCommand')  // false
 * ```
 */
function validateKebabCase(value: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
}
````

### README Updates

Si agregas una nueva funcionalidad, actualiza:

-   README.md: Agrega ejemplos de uso
-   CHANGELOG.md: Documenta el cambio bajo "No Publicado"

### Comentarios en Código

```typescript
// ✅ Correcto: Explica el "por qué", no el "qué"
// Sanitizamos la ruta para prevenir ataques de path traversal
const safePath = sanitizePath(userInput);

// ❌ Incorrecto: Describe lo obvio
// Llama a la función sanitizePath con userInput
const safePath = sanitizePath(userInput);
```

## Comunicación

### Canales

-   **Issues**: Para bugs y solicitudes de funcionalidades
-   **Pull Requests**: Para discutir código
-   **Email**: hormigadev7@gmail.com para temas sensibles

### Mejores Prácticas

-   **Sé respetuoso**: Trata a otros como quieres ser tratado
-   **Sé claro**: Comunica tus ideas claramente
-   **Sé paciente**: Todos estamos aprendiendo
-   **Sé constructivo**: Enfócate en soluciones, no en problemas

## Obtener Ayuda

¿Atascado? ¡No hay problema!

-   **Revisa la documentación**: README.md, código, tests
-   **Busca en issues**: Puede que alguien ya haya preguntado
-   **Crea un issue**: Describe tu pregunta claramente
-   **Envía email**: hormigadev7@gmail.com para ayuda directa

## Reconocimiento

Todos los contribuyentes son reconocidos en:

-   Notas de lanzamiento
-   CHANGELOG.md
-   GitHub contributors page

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la Licencia MIT.

---

**¡Gracias por contribuir a Patto CLI!** 🚀

Tu tiempo y esfuerzo ayudan a hacer esta herramienta mejor para todos. 💙

**Última Actualización:** 14 de Noviembre de 2025  
**Mantenedor:** HormigaDev (hormigadev7@gmail.com)
