// Dans server/src/server.ts
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
    createConnection,
    ProposedFeatures, 
    TextDocuments, 
    InitializeParams,
    ServerCapabilities,
    TextDocumentSyncKind 
} from 'vscode-languageserver/node';

import { AnalysisManager } from './AnalysisManager';
import { parse } from 'path';


console.error('[Server] Tamarin Language Server starting...');
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let analysisManager: AnalysisManager;


connection.onInitialize(async (params: InitializeParams) => {
    const parserPath = params.initializationOptions.parserPath;
    analysisManager = new AnalysisManager();
    await analysisManager.initParser(parserPath)
    console.error('[Server] Received "initialize" request from client.');
    const capabilities: ServerCapabilities = {
        textDocumentSync: TextDocumentSyncKind.Full, 
        definitionProvider: true
    };
    console.error('[Server] Sending server capabilities back.');
    return { capabilities };
});

connection.onInitialized(() => {
    console.error('[Server] Received "initialized" notification. Handshake complete!');
});

documents.onDidChangeContent(async (change) => {
    console.error(`[Server] File changed: ${change.document.uri}. Triggering validation.`);
    const diagnostics = await analysisManager.AnalyseDocument(change.document);

    connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
    console.error(`[Server] Diagnostics sent for ${change.document.uri}.`);
});


documents.listen(connection);
connection.listen();