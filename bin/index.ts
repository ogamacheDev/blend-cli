#!/usr/bin/env node
import render from "./commands/render";

const { Command } = require('commander');
const program = new Command();

program
    .name('blend-cli')
    .version('0.2')
    .argument('<config-file>', 'Specify the config file')
    .option('-e, --engine <engine>', 'specify a render engine')
    .option('-d, --debug', 'enable command logging')
    .action((filePath, options) => render(filePath, options))

program.parse();