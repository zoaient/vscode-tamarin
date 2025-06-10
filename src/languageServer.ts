import * as path from 'path';
import { ExtensionContext } from 'vscode';


import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import * as vscode from 'vscode';

let client: LanguageClient;

export const startLanguageServer = async (context: ExtensionContext) => {
	const documentSelector = [{ scheme: 'file', language: 'tamarin' }]
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc }
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: documentSelector,
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher('**/*.spthy')
		}
	};

	client = new LanguageClient(
		'languageServerTamarin',
		'Tamarin Language Server',
		serverOptions,
		clientOptions
	);

	await client.start();
};


export const stopLanguageServer = async () => {
	await client?.stop();
};