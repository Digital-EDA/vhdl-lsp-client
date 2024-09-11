
import { platform } from 'os';
import * as vscode from 'vscode';
import * as path from 'path';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    Executable,
} from "vscode-languageclient/node";

let client: LanguageClient;

function getLspServerExecutionName() {
    const osname = platform();
    if (osname === 'win32') {
        return 'vhdl-ls.exe';
    }

    return 'vhdl-ls';
}

export function activate(context: vscode.ExtensionContext) {
    const lspServerName = getLspServerExecutionName();
    const lspServerPath = context.asAbsolutePath(
        path.join('resources', 'dide-lsp', 'server', lspServerName)
    );
    const run: Executable = {
        command: lspServerPath,
    };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions: ServerOptions = {
        run,
        debug: run,
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: [
            {
                scheme: 'file',
                language: 'vhdl' 
            }
        ],
    };

    client = new LanguageClient(
        "VHDL LS",      // id of client
        "VHDL LS",      // name of output windows
        serverOptions,
        clientOptions
    );

    client.start();
}

export function deactivate() {
    if (!client) {
        return undefined;
    }
    client.stop();
}