import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mkdir, readdir, rename, rm, writeFile } from 'fs/promises';
import path from 'path';
import { remove as removeDiacritics } from 'diacritics';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import { isGitInstalled, toKebabCase } from '../utils.js';

async function downloadAndExtractZip(projectDir: string): Promise<void> {
    const zipUrl = 'https://github.com/HormigaDev/patto-bot-template/archive/refs/tags/v1.1.0.zip';
    const zipPath = path.join(process.cwd(), 'temp-release.zip');

    try {
        console.log(chalk.blue('Descargando el release v1.1.0 como ZIP...'));
        const response = await fetch(zipUrl);
        if (!response.ok) {
            throw new Error(`No se pudo descargar el release: ${response.statusText}`);
        }

        const buffer = await response.buffer();
        await writeFile(zipPath, buffer);

        console.log(chalk.blue(`Descomprimiendo en ${projectDir}...`));
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(projectDir, true);

        // El ZIP crea una carpeta con el nombre del repositorio y la versión (ej. patto-bot-template-1.1.0)
        const extractedDir = path.join(projectDir, 'patto-bot-template-1.1.0');
        if (existsSync(extractedDir)) {
            const files = await readdir(extractedDir);
            for (const file of files) {
                await rename(path.join(extractedDir, file), path.join(projectDir, file));
            }
            await rm(extractedDir, { recursive: true, force: true });
        }

        await rm(zipPath, { force: true });
    } catch (error) {
        throw new Error(`Error descargando o descomprimiendo el release: ${error}`);
    }
}

export const initCommand = new Command('init')
    .description('Inicializa un nuevo proyecto Patto Bot Template')
    .option('--name <name>', 'Nombre del proyecto')
    .option('--description <description>', 'Descripción del proyecto')
    .action(async (options: { name?: string; description?: string }) => {
        const hasGit = isGitInstalled();

        // Obtener el nombre del proyecto
        let projectName = options.name;
        if (!projectName) {
            const response = await prompts({
                type: 'text',
                name: 'projectName',
                message: chalk.cyan('Ingresa el nombre del proyecto (ej. Patto Bot):'),
                validate: (value: string) =>
                    value.trim().length > 0 ? true : 'El nombre del proyecto no puede estar vacío',
            });

            if (!response.projectName) {
                console.log(chalk.red('Operación cancelada.'));
                process.exit(1);
            }
            projectName = response.projectName;
        }

        // Obtener la descripción del proyecto
        let description = options.description;
        if (!description) {
            const response = await prompts({
                type: 'text',
                name: 'description',
                message: chalk.cyan('Ingresa una descripción para el proyecto:'),
                initial: 'Un bot creado con Patto Bot Template',
            });

            if (!response.description) {
                console.log(chalk.red('Operación cancelada.'));
                process.exit(1);
            }
            description = response.description;
        }

        // Preparar nombres
        projectName = projectName || 'NewPattoBotProject';
        // Nombre para la carpeta: sin espacios ni acentos, conserva mayúsculas/minúsculas
        const folderName = removeDiacritics(projectName).replace(/\s+/g, '');
        // Nombre para package.json: kebab-case (obligatorio para npm)
        const packageName = toKebabCase(projectName);
        const projectDir = path.join(process.cwd(), folderName);

        // Verificar si el directorio ya existe
        if (existsSync(projectDir)) {
            console.log(chalk.red(`El directorio ${folderName} ya existe en ${process.cwd()}.`));
            process.exit(1);
        }

        try {
            // Crear el directorio del proyecto
            await mkdir(projectDir, { recursive: true });

            // Descargar el repositorio
            if (hasGit) {
                console.log(chalk.blue(`Clonando el repositorio en ${folderName}...`));
                execSync(
                    `git clone --quiet --branch v1.1.0 https://github.com/HormigaDev/patto-bot-template.git ${folderName}`,
                    { stdio: 'ignore' },
                );
            } else {
                console.log(
                    chalk.yellow(
                        'Git no está instalado. Descargando el release v1.1.0 como ZIP...',
                    ),
                );
                await downloadAndExtractZip(projectDir);
            }

            // Cambiar al directorio del proyecto
            process.chdir(projectDir);

            // Eliminar la carpeta .git si existe
            const gitDir = path.join(projectDir, '.git');
            if (existsSync(gitDir)) {
                await rm(gitDir, { recursive: true, force: true });
                console.log(chalk.blue('Eliminada la carpeta .git del repositorio original.'));
            }

            // Actualizar package.json
            const packageJsonPath = path.join(projectDir, 'package.json');
            if (existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
                packageJson.name = packageName;
                packageJson.description = description;
                packageJson.version = '0.0.0';
                packageJson.author = '';
                writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
                console.log(chalk.blue('Actualizado package.json con nombre y descripción.'));
            } else {
                console.log(chalk.yellow('No se encontró package.json en el repositorio.'));
            }

            // Inicializar un nuevo repositorio Git (si Git está disponible)
            if (hasGit) {
                console.log(chalk.blue('Inicializando un nuevo repositorio Git...'));
                execSync('git init', { stdio: 'ignore' });
                execSync('git add .', { stdio: 'ignore' });
                execSync('git commit -m "Initial Commit: Project Created" --no-verify', {
                    stdio: 'ignore',
                });
            } else {
                console.log(
                    chalk.yellow(
                        'Git no está instalado. Debes inicializar el repositorio manualmente con:',
                    ),
                );
                console.log(chalk.gray('  git init'));
                console.log(chalk.gray('  git add .'));
                console.log(chalk.gray('  git commit -m "Initial Commit: Project Created"'));
            }

            console.log(chalk.green(`¡Proyecto ${folderName} creado exitosamente!`));
            console.log(chalk.gray(`Para empezar:`));
            console.log(chalk.gray(`  cd ${folderName}`));
            console.log(chalk.gray(`  pnpm install`));
            console.log(chalk.gray(`  pnpm start`));
        } catch (error) {
            console.error(chalk.red(`Error inicializando el proyecto: ${error}`));
            if (existsSync(projectDir)) {
                await rm(projectDir, { recursive: true, force: true });
            }
            process.exit(1);
        }
    });
