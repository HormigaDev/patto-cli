import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const testProjectDir = path.join(process.cwd(), 'test-project-group');
const cliPath = path.join(process.cwd(), 'src', 'index.ts');

describe('Generate Subcommand Group', () => {
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

    it('debería crear un grupo de subcomandos con archivos separados', () => {
        execSync(`tsx ${cliPath} generate subcommand-group -n tools -p admin -s manage`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(
            testProjectDir,
            'src',
            'commands',
            'admin-manage-tools.command.ts',
        );
        const definitionFile = path.join(
            testProjectDir,
            'src',
            'definitions',
            'admin-manage-tools.definition.ts',
        );

        expect(existsSync(commandFile)).toBe(true);
        expect(existsSync(definitionFile)).toBe(true);

        const commandContent = readFileSync(commandFile, 'utf-8');
        const definitionContent = readFileSync(definitionFile, 'utf-8');

        expect(commandContent).toContain(
            'export class AdminManageToolsCommand extends AdminManageToolsDefinition',
        );
        expect(definitionContent).toContain(
            'export abstract class AdminManageToolsDefinition extends BaseCommand',
        );
        expect(definitionContent).toContain(
            "import { SubcommandGroup } from '@/core/decorators/subcommand-group.decorator'",
        );
    });

    it('debería crear un grupo unificado', () => {
        execSync(`tsx ${cliPath} generate subcommand-group -n tools -p admin -s manage -u`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(
            testProjectDir,
            'src',
            'commands',
            'admin-manage-tools.command.ts',
        );
        const definitionFile = path.join(
            testProjectDir,
            'src',
            'definitions',
            'admin-manage-tools.definition.ts',
        );

        expect(existsSync(commandFile)).toBe(true);
        expect(existsSync(definitionFile)).toBe(false);

        const commandContent = readFileSync(commandFile, 'utf-8');
        expect(commandContent).toContain(
            'export class AdminManageToolsCommand extends BaseCommand',
        );
    });

    it('debería fallar si no se proporciona parent', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate subcommand-group -n tools -s manage`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería fallar si no se proporciona subcommand', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate subcommand-group -n tools -p admin`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería fallar si el subcommand no es kebab-case', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate subcommand-group -n tools -p admin -s ManageStuff`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería funcionar con alias "g"', () => {
        execSync(`tsx ${cliPath} generate g -n tools -p admin -s manage`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(
            testProjectDir,
            'src',
            'commands',
            'admin-manage-tools.command.ts',
        );
        expect(existsSync(commandFile)).toBe(true);
    });
});
