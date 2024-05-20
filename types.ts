export interface exportsType {
    blenderFile?: string,
    exportPath: string,
    renders: renders[]
}

interface renders {
    fileName: string,
    blenderFile?: string,
    scene?: string,
    format?: string,
    python?: string,
    pythonText?: string,
    pythonArgs?: pythonArgs[],
    start?: number,
    end?: number
    frame?: number
}

interface pythonArgs {
    name: string,
    value: string
}