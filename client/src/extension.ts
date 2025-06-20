import * as vscode from 'vscode';
import path = require('path');

import { LanguageClient } from 'vscode-languageclient/node';
import { TransportKind } from 'vscode-languageclient/node';


export function activate(context: vscode.ExtensionContext) {
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    const serverOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: { execArgv: ['--nolazy', '--inspect=6009'] } }
    };
    const clientOptions = { documentSelector: [{ scheme: 'file', language: 'tamarin' }] };
    const client = new LanguageClient('tamarinLSP', 'Tamarin Language Server', serverOptions, clientOptions);
    client.start();
}