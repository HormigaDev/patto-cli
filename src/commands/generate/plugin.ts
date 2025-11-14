import { Command } from 'commander';
import chalk from 'chalk';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PluginOptions {
    name?: string;
    global?: boolean;
    folder?: string;
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

function handleGeneratePlugin(options: PluginOptions): void {
    try {
        if (!options.name) {
            console.error(chalk.red('✗ El nombre del plugin es requerido'));
            console.log(chalk.cyan('\nUso: -n <name> o --name <name>'));
            console.log(chalk.gray('\nEjemplo:'));
            console.log(chalk.gray('  patto-cli generate plugin -n my-plugin'));
            process.exit(1);
        }

        const sanitized = sanitizePath(options.name);
        const parts = sanitized.split('/');
        const lastPart = parts[parts.length - 1];

        if (!validateKebabCase(lastPart)) {
            console.error(chalk.red('✗ El nombre del plugin debe estar en kebab-case'));
            console.log(
                chalk.yellow('\n⚠ Formato: solo minúsculas, números y guiones (ej: mi-plugin)'),
            );
            process.exit(1);
        }

        if (options.folder && !validateKebabCase(options.folder)) {
            console.error(chalk.red('✗ El nombre de la carpeta debe estar en kebab-case'));
            console.log(
                chalk.yellow('\n⚠ Formato: solo minúsculas, números y guiones (ej: mi-carpeta)'),
            );
            process.exit(1);
        }

        const className = lastPart
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');

        let scope = 'Specified';
        if (options.global) {
            scope = 'DeepFolder';
        } else if (options.folder) {
            scope = 'Folder';
        }

        const folder = options.folder || '';
        const baseDir = process.cwd();
        const pluginsDir = path.join(baseDir, 'src', 'plugins', ...parts.slice(0, -1));
        const pluginFilePath = path.join(pluginsDir, `${lastPart}.plugin.ts`);

        if (existsSync(pluginFilePath)) {
            console.error(chalk.red(`✗ El archivo ${pluginFilePath} ya existe`));
            process.exit(1);
        }

        mkdirSync(pluginsDir, { recursive: true });

        const templatesDir = path.join(__dirname, '..', '..', 'templates', 'plugins');
        const pluginTemplate = readFileSync(path.join(templatesDir, 'plugin.template'), 'utf-8');
        const registerTemplate = readFileSync(
            path.join(templatesDir, 'register-plugin.template'),
            'utf-8',
        );

        const pluginContent = pluginTemplate.replace(/{{class}}/g, className);

        const pathWithoutLast = parts.slice(0, -1);
        const importPath =
            pathWithoutLast.length > 0
                ? `@/plugins/${pathWithoutLast.join('/')}/${lastPart}.plugin`
                : `@/plugins/${lastPart}.plugin`;

        let registerContent = registerTemplate
            .replace(/{{class}}/g, className)
            .replace(/{{scope}}/g, scope)
            .replace(/{{folder}}/g, folder);

        writeFileSync(pluginFilePath, pluginContent, 'utf-8');
        console.log(chalk.green(`✓ Plugin creado: ${pluginFilePath}`));

        // Agregar import y registro al archivo plugins.config.ts
        const configFilePath = path.join(baseDir, 'src', 'config', 'plugins.config.ts');

        if (!existsSync(configFilePath)) {
            console.log(
                chalk.yellow(`\n⚠ El archivo ${configFilePath} no existe. Creando el archivo...`),
            );
            mkdirSync(path.dirname(configFilePath), { recursive: true });
            writeFileSync(configFilePath, '', 'utf-8');
        }

        let configContent = readFileSync(configFilePath, 'utf-8');

        // Agregar import al inicio si no existe
        const importStatement = `import { ${className}Plugin } from '${importPath}';`;
        if (!configContent.includes(importStatement)) {
            // Insertar después de los últimos imports o al inicio
            const lastImportIndex = configContent.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLine = configContent.indexOf('\n', lastImportIndex);
                configContent =
                    configContent.slice(0, endOfLine + 1) +
                    importStatement +
                    '\n' +
                    configContent.slice(endOfLine + 1);
            } else {
                configContent = importStatement + '\n\n' + configContent;
            }
            console.log(chalk.green(`✓ Import agregado a ${configFilePath}`));
        } else {
            console.log(chalk.yellow(`⚠ El import ya existe en ${configFilePath}`));
        }

        // Agregar código de registro al final
        const registrationCode = registerContent
            .replace(/{{class}}/g, className)
            .replace(/{{scope}}/g, scope)
            .replace(/{{folder}}/g, folder);

        if (!configContent.includes(registrationCode)) {
            // Agregar al final del archivo
            configContent = configContent.trimEnd() + '\n\n' + registrationCode + '\n';
            console.log(chalk.green(`✓ Código de registro agregado a ${configFilePath}`));
        } else {
            console.log(chalk.yellow(`⚠ El código de registro ya existe en ${configFilePath}`));
        }

        // Escribir el archivo actualizado
        writeFileSync(configFilePath, configContent, 'utf-8');

        console.log(chalk.green(`\n✓ Plugin "${lastPart}" creado y registrado exitosamente!`));
    } catch (error) {
        console.error(chalk.red(`\n✗ Error generando el plugin: ${error}`));
        process.exit(1);
    }
}

export const pluginSubcommand = new Command('plugin')
    .alias('p')
    .description('Genera un plugin para el bot')
    .option(
        '-n, --name <name>',
        'Nombre del plugin en kebab-case (ej: my-plugin o utils/my-plugin)',
    )
    .option(
        '--global',
        'El plugin se aplicará a todos los comandos en la carpeta especificada y subcarpetas (PluginScope.DeepFolder)',
    )
    .option(
        '--folder <folder>',
        'Carpeta específica donde se aplicará el plugin. Si se usa con --global aplica a subcarpetas también',
    )
    .action((options: PluginOptions) => handleGeneratePlugin(options));
