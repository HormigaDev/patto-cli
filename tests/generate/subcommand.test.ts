import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const testProjectDir = path.join(process.cwd(), 'test-project-subcommand');
const cliPath = path.join(process.cwd(), 'src', 'index.ts');

describe('Generate Subcommand', () => {
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

    it('debería crear un subcomando con archivos separados', () => {
        execSync(`tsx ${cliPath} generate subcommand -n helper -p user`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(testProjectDir, 'src', 'commands', 'user-helper.command.ts');
        const definitionFile = path.join(
            testProjectDir,
            'src',
            'definitions',
            'user-helper.definition.ts',
        );

        expect(existsSync(commandFile)).toBe(true);
        expect(existsSync(definitionFile)).toBe(true);

        const commandContent = readFileSync(commandFile, 'utf-8');
        const definitionContent = readFileSync(definitionFile, 'utf-8');

        expect(commandContent).toContain(
            'export class UserHelperCommand extends UserHelperDefinition',
        );
        expect(definitionContent).toContain(
            'export abstract class UserHelperDefinition extends BaseCommand',
        );
        expect(definitionContent).toContain(
            "import { Subcommand } from '@/core/decorators/subcommand.decorator'",
        );
    });

    it('debería crear un subcomando unificado', () => {
        execSync(`tsx ${cliPath} generate subcommand -n helper -p user -u`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(testProjectDir, 'src', 'commands', 'user-helper.command.ts');
        const definitionFile = path.join(
            testProjectDir,
            'src',
            'definitions',
            'user-helper.definition.ts',
        );

        expect(existsSync(commandFile)).toBe(true);
        expect(existsSync(definitionFile)).toBe(false);

        const commandContent = readFileSync(commandFile, 'utf-8');
        expect(commandContent).toContain('export class UserHelperCommand extends BaseCommand');
    });

    it('debería fallar si no se proporciona parent', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate subcommand -n helper`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería fallar si el parent no es kebab-case', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate subcommand -n helper -p UserParent`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería funcionar con alias "s"', () => {
        execSync(`tsx ${cliPath} generate s -n helper -p user`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const commandFile = path.join(testProjectDir, 'src', 'commands', 'user-helper.command.ts');
        expect(existsSync(commandFile)).toBe(true);
    });
});
