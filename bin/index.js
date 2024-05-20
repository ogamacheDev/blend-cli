#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var render_1 = require("./commands/render");
var Command = require('commander').Command;
var program = new Command();
program
    .name('blend-cli')
    .version('0.1')
    .argument('<config-file>', 'Specify the config file')
    .option('-e, --engine <engine>', 'specify a render engine')
    .option('-d, --debug', 'enable command logging')
    .action(function (filePath, options) { return (0, render_1.default)(filePath, options); });
program.parse();
