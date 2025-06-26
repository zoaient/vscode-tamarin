import { ExtensionContext } from 'vscode';
import { startLanguageServer, stopLanguageServer } from './languageServer';

export async function activate(context: ExtensionContext) {
    console.log('[Client] Activating Tamarin extension...');
    await startLanguageServer(context);
}

export async function deactivate() {
    await stopLanguageServer();
}

