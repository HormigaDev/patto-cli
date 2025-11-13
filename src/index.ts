#!/usr/bin/env node

import { Command } from 'commander';
import * as loader from './loader';

const program = new Command()
    .name('Patto CLI Template')
    .version('1.0.0', '-V, --version, --versión')
    .description('Template profesional de CLI con Typescript');

Object.values(loader).forEach((command) => {
    program.addCommand(command);
});

program.parse(process.argv);
