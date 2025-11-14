import { Command } from 'commander';
import { commandSubcommand } from './generate/command.js';
import { subcommandSubcommand } from './generate/subcommand.js';
import { groupSubcommand } from './generate/subcommand-group.js';
import { pluginSubcommand } from './generate/plugin.js';

export const generateCommand = new Command('generate')
    .alias('g')
    .description('Genera comandos, subcomandos, grupos o plugins para tu bot de Discord')
    .addCommand(commandSubcommand)
    .addCommand(subcommandSubcommand)
    .addCommand(groupSubcommand)
    .addCommand(pluginSubcommand);
