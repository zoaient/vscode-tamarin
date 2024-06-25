import * as vscode from 'vscode'
import Parser =require( "web-tree-sitter");


let diagnostics = vscode.languages.createDiagnosticCollection('Tamarin');



function get_child_index(node : Parser.SyntaxNode): number|null{
    if(node.parent === null ){
        return null;
    }
    const children = node.parent.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].id === node.id) {
        return i >= 0 ? i : null;
      }
    }
    return 0;

}



async function detect_errors(): Promise<void> {
    let editor = vscode.window.activeTextEditor;
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

    function build_error_display(node : Parser.SyntaxNode, editeur: vscode.TextEditor, message : string){
        let start = node.startIndex;
        let end = node.endIndex;
        let positionStart = editeur.document.positionAt(start);
        let positionEnd = editeur.document.positionAt(end);
        let existingDiag = diags.find(d => d.range.contains(positionStart)); // Evite les superpositions de diagnostics
        if (!existingDiag) {
        diags.push(new vscode.Diagnostic(new vscode.Range(positionStart, positionStart.translate(0,0) ), message, vscode.DiagnosticSeverity.Error));
        }
    }

    function findMatches(node : Parser.SyntaxNode, editeur: vscode.TextEditor ) {
        if ((node.isMissing)) {
            let myId = get_child_index(node);
            if(myId === null){
                return ;
            }
            if(node.parent?.child(myId-1)?.type === 'single_comment'){
                let start ;
                if(node.parent.child(myId-2) != null ){
                    start = node.parent.child(myId-2)?.endIndex;
                }
                else {
                    start = 0
                }
                let positionStart = editeur.document.positionAt(start?? 0);
                let existingDiag = diags.find(d => d.range.contains(positionStart)); // Evite les superpositions de diagnostics
                if (!existingDiag) {
                    diags.push(new vscode.Diagnostic(new vscode.Range(positionStart, positionStart.translate(0,0) ), node.toString().slice(1, -1), vscode.DiagnosticSeverity.Error));
                }
            }
            else {
            build_error_display(node, editeur ,node.toString().slice(1,-1));
            }
        }
        else if ( node.toString().includes('ERROR')){
            if(node.toString().includes('built_in') && node.childCount === 1){
                build_error_display(node, editeur, 'Incorrect built-in function name maybe "," is missing');
            }
           /* else if (node.parent?.toString().includes('function_identifier')){
                build_error_display(node, editeur, 'Incorrect function definition')
            }*/
            else{
                build_error_display(node, editeur ,node.toString().slice(1,-1));
            }
        }
        for (let child of node.children) {
            findMatches(child,editeur);
        }
        
    }

    findMatches(tree.rootNode,editor);

    diagnostics.set(editor.document.uri, diags);
    


}

export function display_syntax_errors(context: vscode.ExtensionContext) {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        let changed_content = vscode.workspace.onDidChangeTextDocument((event) => {
            if (event.document === editor.document) {
                detect_errors();
            }
        });
        detect_errors();
        context.subscriptions.push(changed_content, diagnostics);
    }
}

