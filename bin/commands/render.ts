import {exportsType} from "../../types";
import {readFileSync} from "fs";
import {OptionValues} from "commander";
const shell = require('shelljs');

export default function(filePath: string, options: OptionValues) {
    let exportsConfig: exportsType;
    console.time('Render completed')

    try {
        const fileData = readFileSync(filePath, {encoding: "utf8"})
        exportsConfig = JSON.parse(fileData)
    } catch (e) {
        throw `An error occurred reading the config file: ${e}`
    }

    exportsConfig.renders.forEach(renderConfig => {
        const exportPath = exportsConfig.exportPath + '/';
        const isAnimation = renderConfig.frame == undefined;
        const hasFrames = renderConfig.start != undefined && renderConfig.end != undefined;

        // Error handling
        if (!renderConfig.blenderFile && !exportsConfig.blenderFile) throw '"blenderFile" not specified in exports or renders';
        if (!exportsConfig.exportPath) throw '"exportPath" not specified in exports';
        if (!renderConfig.fileName) throw `"fileName" file not specified in render: ${renderConfig.fileName}`;

        // Arguments
        const inputArgs = `-b ${renderConfig.blenderFile ? renderConfig.blenderFile : exportsConfig.blenderFile}`;
        const pythonArgs = renderConfig.python ? `--python "${renderConfig.python}"` : renderConfig.pythonText ? `--python-text ${renderConfig.pythonText}` : '';
        const outputArgs = `-o "${exportPath + renderConfig.fileName}"`;
        const sceneArgs = renderConfig.scene ? `-S "${renderConfig.scene}"` : '';
        const engineArgs = options.engine ? `-E ${options.engine}`: '';
        const renderArgs = isAnimation && hasFrames ? `-s ${renderConfig.start} -e ${renderConfig.end} -a` : !isAnimation ? `-f ${renderConfig.frame}` : '-a';
        const renderFormatArgs = renderConfig.format ? `-F ${renderConfig.format}`: '';
        const pythonConfigArgs = pythonArgs && renderConfig.pythonArgs ? `-- ${renderConfig.pythonArgs.map((arg) => `${arg.name}="${arg.value}"`).join(" ")}` : '';

        // Command build
        const args = [inputArgs, pythonArgs, sceneArgs, outputArgs, engineArgs, renderFormatArgs, renderArgs, pythonConfigArgs].filter(arg => arg != '');
        const command = `blender ${args.join(' ')}`;

        console.log(`Rendering: ${renderConfig.fileName}`);
        if (options.debug) console.log(`Command: ${command}`);
        shell.exec(command, { silent: !options.debug ?? true });
    })
    console.timeEnd('Render completed')
}