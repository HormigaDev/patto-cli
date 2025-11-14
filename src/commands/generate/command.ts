import { Command } from 'commander';
import chalk from 'chalk';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GenerateOptions {
    name?: string;
    unified?: boolean;
    description?: string;
}

function sanitizePath(inputPath: string): string {
    const parts = inputPath
        .split('/')
        .filter((part) => part !== '..' && part !== '.' && part !== '');
    return parts.join('/');
}

function validateKebabCase(value: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
}

function parseCommandName(name: string): { fileName: string; className: string; parts: string[] } {
    const sanitized = sanitizePath(name);
    const parts = sanitized.split('/');
    const lastPart = parts[parts.length - 1];

    if (!validateKebabCase(lastPart)) {
        throw new Error(
            `El nombre "${lastPart}" debe estar en kebab-case (sin espacios, acentos, solo minúsculas, números y guiones)`,
        );
    }

    const toPascalCase = (str: string) =>
        str
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');

    const fileName = lastPart;
    const className = toPascalCase(lastPart);

    return { fileName, className, parts };
}

function getDecoratorTemplate(): string {
    const templatesDir = path.join(__dirname, '..', '..', 'templates');
    return readFileSync(path.join(templatesDir, 'command.decorator.template'), 'utf-8');
}

function getDecoratorImport(): string {
    return "import { Command } from '@/core/decorators/command.decorator';";
}

function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
}

function createUnifiedFile(
    baseDir: string,
    fileName: string,
    className: string,
    options: GenerateOptions,
): void {
    const commandsDir = path.join(baseDir, 'src', 'commands');
    const filePath = path.join(commandsDir, `${fileName}.command.ts`);

    if (existsSync(filePath)) {
        throw new Error(`El archivo ${filePath} ya existe`);
    }

    mkdirSync(path.dirname(filePath), { recursive: true });

    const decoratorImport = getDecoratorImport();
    const baseImport = "import { BaseCommand } from '@/core/structures/BaseCommand';";

    let decorator = getDecoratorTemplate();
    const variables: Record<string, string> = {
        commandName: fileName,
        name: fileName,
        description: options.description || '',
        commandDescription: options.description || '',
    };

    decorator = replaceTemplateVariables(decorator, variables);

    const content = `${decoratorImport}\n${baseImport}\n\n${decorator}\nexport class ${className}Command extends BaseCommand {
    async run(): Promise<void> {
        // Tu código aquí
    }
}\n`;

    writeFileSync(filePath, content, 'utf-8');
    console.log(chalk.green(`✓ Archivo creado: ${filePath}`));
}

function createSplitFiles(
    baseDir: string,
    fileName: string,
    className: string,
    pathParts: string[],
    options: GenerateOptions,
): void {
    const commandsDir = path.join(baseDir, 'src', 'commands', ...pathParts.slice(0, -1));
    const definitionsDir = path.join(baseDir, 'src', 'definitions', ...pathParts.slice(0, -1));

    const commandFilePath = path.join(commandsDir, `${fileName}.command.ts`);
    const definitionFilePath = path.join(definitionsDir, `${fileName}.definition.ts`);

    if (existsSync(commandFilePath)) {
        throw new Error(`El archivo ${commandFilePath} ya existe`);
    }

    if (existsSync(definitionFilePath)) {
        throw new Error(`El archivo ${definitionFilePath} ya existe`);
    }

    mkdirSync(commandsDir, { recursive: true });
    mkdirSync(definitionsDir, { recursive: true });

    const decoratorImport = getDecoratorImport();
    const baseImport = "import { BaseCommand } from '@/core/structures/BaseCommand';";

    let decorator = getDecoratorTemplate();
    const variables: Record<string, string> = {
        commandName: fileName,
        name: fileName,
        description: options.description || '',
        commandDescription: options.description || '',
    };

    decorator = replaceTemplateVariables(decorator, variables);

    const definitionContent = `${decoratorImport}\n${baseImport}\n\n${decorator}\nexport abstract class ${className}Definition extends BaseCommand {
    // Tus argumentos aquí
}\n`;

    writeFileSync(definitionFilePath, definitionContent, 'utf-8');
    console.log(chalk.green(`✓ Definición creada: ${definitionFilePath}`));

    const pathWithoutLast = pathParts.slice(0, -1);
    const definitionImportPath =
        pathWithoutLast.length > 0
            ? `@/definitions/${pathWithoutLast.join('/')}/${fileName}.definition`
            : `@/definitions/${fileName}.definition`;
    const commandImport = `import { ${className}Definition } from '${definitionImportPath}';`;

    const commandContent = `${commandImport}\n\nexport class ${className}Command extends ${className}Definition {
    async run(): Promise<void> {
        // Tu código aquí
    }
}\n`;

    writeFileSync(commandFilePath, commandContent, 'utf-8');
    console.log(chalk.green(`✓ Comando creado: ${commandFilePath}`));
}

function handleGenerateCommand(options: GenerateOptions): void {
    try {
        if (!options.name) {
            console.error(chalk.red('✗ El nombre es requerido'));
            console.log(chalk.cyan('\nUso: -n <name> o --name <name>'));
            console.log(chalk.gray('\nEjemplo:'));
            console.log(chalk.gray('  patto-cli generate command -n my-command'));
            process.exit(1);
        }

        if (!options.description) {
            options.description = '';
        }

        const { fileName, className, parts } = parseCommandName(options.name);
        const baseDir = process.cwd();

        if (options.unified) {
            createUnifiedFile(baseDir, fileName, className, options);
            console.log(chalk.green(`\n✓ Comando unificado "${fileName}" creado exitosamente!`));
        } else {
            createSplitFiles(baseDir, fileName, className, parts, options);
            console.log(
                chalk.green(
                    `\n✓ Comando "${fileName}" creado exitosamente con archivos separados!`,
                ),
            );
        }
    } catch (error) {
        console.error(chalk.red(`\n✗ Error generando el comando: ${error}`));
        process.exit(1);
    }
}

export const commandSubcommand = new Command('command')
    .alias('c')
    .description('Genera un comando')
    .option('-n, --name <name>', 'Nombre del comando (en kebab-case)')
    .option('-u, --unified', 'Crear un archivo unificado en lugar de separar definition y command')
    .option('-d, --description <description>', 'Descripción del comando')
    .action((options: GenerateOptions) => handleGenerateCommand(options));
