import * as vscode from 'vscode'
import {  QueryMatch, QueryCapture } from 'web-tree-sitter';
import Parser =require( "web-tree-sitter");


let diagnostics = vscode.languages.createDiagnosticCollection('Tamarin');

async function detect_errors(context: vscode.ExtensionContext): Promise<void> {
    let editor = vscode.window.activeTextEditor;
    //const parser = createParser();
    await Parser.init();
    const parser = new Parser();
    const Tamarin =   await Parser.Language.load('/Users/hugo/Documents/Telecom Nancy/2A/Stage/vscode-tamarin/src/grammar/parser-tamarin.wasm');
    parser.setLanguage(Tamarin);
    if (!editor) {
        return;
    }
    let diags: vscode.Diagnostic[] = [];
    let text = editor.document.getText();
    const tree =  parser.parse(text);

    function findMatches(node : Parser.SyntaxNode, editeur: vscode.TextEditor ) {
        if ((node.toString().includes('MISSING') && node.childCount === 0)  || (node.toString().includes('ERROR') )) {
            let start = node.startIndex;
            let end = node.endIndex;
            let position = editeur.document.positionAt(start);
            let existingDiag = diags.find(d => d.range.contains(position));
            let message = node.toString().slice(1,-1)
            if (!existingDiag) {
            diags.push(new vscode.Diagnostic(new vscode.Range(position, position.translate(0,0)), message, vscode.DiagnosticSeverity.Error));
            }
        }
        for (let child of node.children) {
            findMatches(child,editeur);
        }
        
    }

    findMatches(tree.rootNode,editor);

    diagnostics.set(editor.document.uri, diags);
    


}

export function display_errors(context: vscode.ExtensionContext) {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        let changed_content = vscode.workspace.onDidChangeTextDocument((event) => {
            if (event.document === editor.document) {
                detect_errors(context);
            }
        });
        detect_errors(context);
        context.subscriptions.push(changed_content, diagnostics);
    }
}

