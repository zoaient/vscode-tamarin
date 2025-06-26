// Dans server/src/server.ts
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
    createConnection,
    ProposedFeatures, 
    TextDocuments, 
    Diagnostic,
    InitializeParams,
    ServerCapabilities,
    TextDocumentSyncKind 
} from 'vscode-languageserver/node';


console.error('[Server] Tamarin Language Server starting...');
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);


connection.onInitialize((params: InitializeParams) => {
    console.error('[Server] Received "initialize" request from client.');
    const capabilities: ServerCapabilities = {
        textDocumentSync: TextDocumentSyncKind.Full, 
    };
    console.error('[Server] Sending server capabilities back.');
    return { capabilities };
});

connection.onInitialized(() => {
    console.error('[Server] Received "initialized" notification. Handshake complete!');
});

documents.onDidChangeContent(change => {
    console.error(`[Server] File changed: ${change.document.uri}. Triggering validation.`);
    validateTextDocument(change.document);
});


async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const text = textDocument.getText();
    const diagnostics: Diagnostic[] = [];
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

documents.listen(connection);

connection.listen();