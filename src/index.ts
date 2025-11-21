#!/usr/bin/env node

import { Command } from 'commander';
import * as loader from './loader.js';

const cliName = 'Patto CLI';
const program = new Command()
    .name(cliName)
    .version(`${cliName} v0.0.4`, '-v, --version')
    .description('Herramienta de línea de comandos para trabajar con Patto Bot Template');

Object.values(loader).forEach((command) => {
    program.addCommand(command);
});

program.parse(process.argv);
