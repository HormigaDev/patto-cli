import { Command } from 'commander';
import chalk from 'chalk';

export const exampleCommand = new Command('example')
    .description('Este es un comando de ejemplo. Aquí va tú descripción de comando')
    .action((...args) => {
        console.log(args);
        console.log(chalk.green(`Este comando recibió ${chalk.gray(args.length)} comandos`));
    });
