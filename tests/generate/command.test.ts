import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const testProjectDir = path.join(process.cwd(), 'test-project-command');
const cliPath = path.join(process.cwd(), 'src', 'index.ts');

describe('Generate Command', () => {
    beforeEach(() => {
        if (existsSync(testProjectDir)) {
            rmSync(testProjectDir, { recursive: true, force: true });
        }
        mkdirSync(testProjectDir, { recursive: true });
        mkdirSync(path.join(testProjectDir, 'src'), { recursive: true });
        mkdirSync(path.join(testProjectDir, 'src', 'commands'), { recursive: true });
        mkdirSync(path.join(testProjectDir, 'src', 'definitions'), { recursive: true });
    });

    afterEach(() => {
        if (existsSync(testProjectDir)) {
            rmSync(testProjectDir, { recursive: true, force: true });
        }
    });

    it('debería crear un comando con archivos separados', () => {
        execSync(`tsx ${cliPath} generate command -n test-command`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(testProjectDir, 'src', 'commands', 'test-command.command.ts');
        const definitionFile = path.join(
            testProjectDir,
            'src',
            'definitions',
            'test-command.definition.ts',
        );

        expect(existsSync(commandFile)).toBe(true);
        expect(existsSync(definitionFile)).toBe(true);

        const commandContent = readFileSync(commandFile, 'utf-8');
        const definitionContent = readFileSync(definitionFile, 'utf-8');

        expect(commandContent).toContain(
            'export class TestCommandCommand extends TestCommandDefinition',
        );
        expect(commandContent).toContain(
            "import { TestCommandDefinition } from '@/definitions/test-command.definition'",
        );
        expect(definitionContent).toContain(
            'export abstract class TestCommandDefinition extends BaseCommand',
        );
        expect(definitionContent).toContain(
            "import { Command } from '@/core/decorators/command.decorator'",
        );
    });

    it('debería crear un comando unificado', () => {
        execSync(`tsx ${cliPath} generate command -n test-command -u`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(testProjectDir, 'src', 'commands', 'test-command.command.ts');
        const definitionFile = path.join(
            testProjectDir,
            'src',
            'definitions',
            'test-command.definition.ts',
        );

        expect(existsSync(commandFile)).toBe(true);
        expect(existsSync(definitionFile)).toBe(false);

        const commandContent = readFileSync(commandFile, 'utf-8');
        expect(commandContent).toContain('export class TestCommandCommand extends BaseCommand');
        expect(commandContent).toContain(
            "import { Command } from '@/core/decorators/command.decorator'",
        );
    });

    it('debería crear comando con descripción', () => {
        execSync(`tsx ${cliPath} generate command -n test-command -d "Mi descripción de prueba"`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const definitionFile = path.join(
            testProjectDir,
            'src',
            'definitions',
            'test-command.definition.ts',
        );
        const definitionContent = readFileSync(definitionFile, 'utf-8');

        expect(definitionContent).toContain('Mi descripción de prueba');
    });

    it('debería crear comando en carpeta anidada', () => {
        execSync(`tsx ${cliPath} generate command -n utils/test-command`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(
            testProjectDir,
            'src',
            'commands',
            'utils',
            'test-command.command.ts',
        );
        const definitionFile = path.join(
            testProjectDir,
            'src',
            'definitions',
            'utils',
            'test-command.definition.ts',
        );

        expect(existsSync(commandFile)).toBe(true);
        expect(existsSync(definitionFile)).toBe(true);

        const commandContent = readFileSync(commandFile, 'utf-8');
        expect(commandContent).toContain(
            "import { TestCommandDefinition } from '@/definitions/utils/test-command.definition'",
        );
    });

    it('debería fallar si el nombre no es kebab-case', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate command -n TestCommand`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería fallar si el nombre tiene espacios', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate command -n "test command"`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería fallar si el nombre tiene acentos', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate command -n "test-comándó"`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería fallar si el archivo ya existe', () => {
        execSync(`tsx ${cliPath} generate command -n test-command`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        expect(() => {
            execSync(`tsx ${cliPath} generate command -n test-command`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería prevenir path traversal', () => {
        execSync(`tsx ${cliPath} generate command -n "../../../malicious"`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(testProjectDir, 'src', 'commands', 'malicious.command.ts');
        expect(existsSync(commandFile)).toBe(true);

        const maliciousFile = path.join(testProjectDir, '..', '..', '..', 'malicious.command.ts');
        expect(existsSync(maliciousFile)).toBe(false);
    });

    it('debería funcionar con alias "c"', () => {
        execSync(`tsx ${cliPath} generate c -n test-command`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(testProjectDir, 'src', 'commands', 'test-command.command.ts');
        expect(existsSync(commandFile)).toBe(true);
    });
});
