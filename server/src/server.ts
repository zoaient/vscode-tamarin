// Dans server/src/server.ts
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createConnection, ProposedFeatures, TextDocuments, Diagnostic } from 'vscode-languageserver/node';



const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const text = textDocument.getText();
	documents.onDidChangeContent((change: { document: TextDocument }) => {
		validateTextDocument(change.document);
	});
    const diagnostics: Diagnostic[] = [];
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
