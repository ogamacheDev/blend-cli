"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var shell = require('shelljs');
function default_1(filePath, options) {
    var exportsConfig;
    console.time('Render completed');
    try {
        var fileData = (0, fs_1.readFileSync)(filePath, { encoding: "utf8" });
        exportsConfig = JSON.parse(fileData);
    }
    catch (e) {
        throw "An error occurred reading the config file: ".concat(e);
    }
    exportsConfig.renders.forEach(function (renderConfig) {
        var _a;
        var exportPath = exportsConfig.exportPath + '/';
        var isAnimation = renderConfig.frame == undefined;
        var hasFrames = renderConfig.start != undefined && renderConfig.end != undefined;
        // Error handling
        if (!renderConfig.blenderFile && !exportsConfig.blenderFile)
            throw '"blenderFile" not specified in exports or renders';
        if (!exportsConfig.exportPath)
            throw '"exportPath" not specified in exports';
        if (!renderConfig.fileName)
            throw "\"fileName\" file not specified in render: ".concat(renderConfig.fileName);
        // Arguments
        var inputArgs = "-b ".concat(renderConfig.blenderFile ? renderConfig.blenderFile : exportsConfig.blenderFile);
        var pythonArgs = renderConfig.python ? "--python \"".concat(renderConfig.python, "\"") : renderConfig.pythonText ? "--python-text ".concat(renderConfig.pythonText) : '';
        var outputArgs = "-o \"".concat(exportPath + renderConfig.fileName, "\"");
        var sceneArgs = renderConfig.scene ? "-S \"".concat(renderConfig.scene, "\"") : '';
        var engineArgs = options.engine ? "-E ".concat(options.engine) : '';
        var renderArgs = isAnimation && hasFrames ? "-s ".concat(renderConfig.start, " -e ").concat(renderConfig.end, " -a") : !isAnimation ? "-f ".concat(renderConfig.frame) : '-a';
        var renderFormatArgs = renderConfig.format ? "-F ".concat(renderConfig.format) : '';
        var pythonConfigArgs = pythonArgs && renderConfig.pythonArgs ? "-- ".concat(renderConfig.pythonArgs.map(function (arg) { return "".concat(arg.name, "=\"").concat(arg.value, "\""); }).join(" ")) : '';
        // Command build
        var args = [inputArgs, pythonArgs, outputArgs, sceneArgs, engineArgs, renderFormatArgs, renderArgs, pythonConfigArgs].filter(function (arg) { return arg != ''; });
        var command = "blender ".concat(args.join(' '));
        console.log("Rendering: ".concat(renderConfig.fileName));
        if (options.debug)
            console.log("Command: ".concat(command));
        shell.exec(command, { silent: (_a = !options.debug) !== null && _a !== void 0 ? _a : true });
    });
    console.timeEnd('Render completed');
}
exports.default = default_1;
