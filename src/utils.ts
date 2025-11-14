import { execSync } from 'child_process';
import { remove as removeDiacritics } from 'diacritics';

export function toKebabCase(input: string): string {
    return removeDiacritics(input)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function isGitInstalled(): boolean {
    try {
        execSync('git --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}
