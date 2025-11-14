import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const testProjectDir = path.join(process.cwd(), 'test-project-plugin');
const cliPath = path.join(process.cwd(), 'src', 'index.ts');

describe('Generate Plugin', () => {
    beforeEach(() => {
        if (existsSync(testProjectDir)) {
            rmSync(testProjectDir, { recursive: true, force: true });
        }
        mkdirSync(testProjectDir, { recursive: true });
        mkdirSync(path.join(testProjectDir, 'src'), { recursive: true });
        mkdirSync(path.join(testProjectDir, 'src', 'plugins'), { recursive: true });
        mkdirSync(path.join(testProjectDir, 'src', 'config'), { recursive: true });
    });

    afterEach(() => {
        if (existsSync(testProjectDir)) {
            rmSync(testProjectDir, { recursive: true, force: true });
        }
    });

    it('debería crear un plugin básico', () => {
        execSync(`tsx ${cliPath} generate plugin -n test-plugin`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const pluginFile = path.join(testProjectDir, 'src', 'plugins', 'test-plugin.plugin.ts');
        const configFile = path.join(testProjectDir, 'src', 'config', 'plugins.config.ts');

        expect(existsSync(pluginFile)).toBe(true);
        expect(existsSync(configFile)).toBe(true);

        const pluginContent = readFileSync(pluginFile, 'utf-8');
        expect(pluginContent).toContain('TestPluginPlugin');
        expect(pluginContent).toContain('extends BasePlugin');

        const configContent = readFileSync(configFile, 'utf-8');
        expect(configContent).toContain(
            "import { TestPluginPlugin } from '@/plugins/test-plugin.plugin';",
        );
        expect(configContent).toContain('new TestPluginPlugin()');
    });

    it('debería crear plugin con scope Folder', () => {
        execSync(`tsx ${cliPath} generate plugin -n auth-plugin --folder commands`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const pluginFile = path.join(testProjectDir, 'src', 'plugins', 'auth-plugin.plugin.ts');
        const configFile = path.join(testProjectDir, 'src', 'config', 'plugins.config.ts');

        expect(existsSync(pluginFile)).toBe(true);

        const configContent = readFileSync(configFile, 'utf-8');
        expect(configContent).toContain('PluginScope.Folder');
        expect(configContent).toContain("'commands'");
    });

    it('debería crear plugin con scope DeepFolder', () => {
        execSync(`tsx ${cliPath} generate plugin -n logger-plugin --global --folder utils`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const pluginFile = path.join(testProjectDir, 'src', 'plugins', 'logger-plugin.plugin.ts');
        const configFile = path.join(testProjectDir, 'src', 'config', 'plugins.config.ts');

        expect(existsSync(pluginFile)).toBe(true);

        const configContent = readFileSync(configFile, 'utf-8');
        expect(configContent).toContain('PluginScope.DeepFolder');
        expect(configContent).toContain("'utils'");
    });

    it('debería crear plugin en carpeta anidada', () => {
        execSync(`tsx ${cliPath} generate plugin -n utils/validator-plugin`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const pluginFile = path.join(
            testProjectDir,
            'src',
            'plugins',
            'utils',
            'validator-plugin.plugin.ts',
        );
        const configFile = path.join(testProjectDir, 'src', 'config', 'plugins.config.ts');

        expect(existsSync(pluginFile)).toBe(true);

        const configContent = readFileSync(configFile, 'utf-8');
        expect(configContent).toContain(
            "import { ValidatorPluginPlugin } from '@/plugins/utils/validator-plugin.plugin';",
        );
    });

    it('debería fallar si el nombre del plugin no es kebab-case', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate plugin -n MyPlugin`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();

        const pluginFile = path.join(testProjectDir, 'src', 'plugins', 'MyPlugin.plugin.ts');
        expect(existsSync(pluginFile)).toBe(false);
    });

    it('debería fallar si el plugin ya existe', () => {
        execSync(`tsx ${cliPath} generate plugin -n existing-plugin`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        expect(() => {
            execSync(`tsx ${cliPath} generate plugin -n existing-plugin`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería fallar si el nombre de la carpeta no es kebab-case', () => {
        expect(() => {
            execSync(`tsx ${cliPath} generate plugin -n test-plugin --folder MyFolder`, {
                cwd: testProjectDir,
                stdio: 'pipe',
            });
        }).toThrow();
    });

    it('debería agregar múltiples plugins sin duplicar imports', () => {
        execSync(`tsx ${cliPath} generate plugin -n plugin-one`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        execSync(`tsx ${cliPath} generate plugin -n plugin-two`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const configFile = path.join(testProjectDir, 'src', 'config', 'plugins.config.ts');
        const configContent = readFileSync(configFile, 'utf-8');

        expect(configContent).toContain('PluginOnePlugin');
        expect(configContent).toContain('PluginTwoPlugin');

        const pluginOneMatches = configContent.match(/import { PluginOnePlugin }/g);
        const pluginTwoMatches = configContent.match(/import { PluginTwoPlugin }/g);
        expect(pluginOneMatches?.length).toBe(1);
        expect(pluginTwoMatches?.length).toBe(1);
    });

    it('debería funcionar con alias "p"', () => {
        execSync(`tsx ${cliPath} generate p -n shortcut-plugin`, {
            cwd: testProjectDir,
            stdio: 'pipe',
        });

        const pluginFile = path.join(testProjectDir, 'src', 'plugins', 'shortcut-plugin.plugin.ts');
        expect(existsSync(pluginFile)).toBe(true);
    });
});
