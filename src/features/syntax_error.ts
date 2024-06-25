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



async function detect_errors(editeur: vscode.TextEditor): Promise<void> {
    let editor = editeur;
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
        let positionStart = editeur.document.positionAt(start);
        let existingDiag = diags.find(d => d.range.contains(positionStart)); // Evite les superpositions de diagnostics
        if (!existingDiag) {
        diags.push(new vscode.Diagnostic(new vscode.Range(positionStart, positionStart.translate(0,0) ), message, vscode.DiagnosticSeverity.Error));
        }
    }


    function typesOfError(node : Parser.SyntaxNode, editeur: vscode.TextEditor){
        if(node.grammarType === 'theory' || node.nextSibling?.nextSibling?.grammarType === 'begin' || node.nextSibling?.grammarType === 'begin'){
            build_error_display(node, editeur, "missing 'theory' or 'begin'")

        }
        else if(node.firstChild?.grammarType === "builtins" || node.firstChild?.grammarType === "functions" || node.firstChild?.grammarType === "macros" ){
            build_error_display(node, editeur, "missing ':' ");
        }
        else if ( node.nextSibling?.grammarType === 'built_in'){
            build_error_display(node, editeur, "missing ',' ");   
        }
        else if(node.firstChild?.grammarType === "rule" && (node.firstChild.nextSibling?.grammarType != "ident" || node.firstChild.nextSibling?.nextSibling?.grammarType != ":") ){
            build_error_display(node, editeur, "missing ':' or rule name ");
        }
        else if(node.firstChild?.grammarType === "lemma"){
            build_error_display(node, editeur, "missing ':' or lemma name ");
        }
        else if (node.firstChild?.grammarType === "premise" || (node.firstChild?.grammarType === "rule" && (node.firstChild.nextSibling?.grammarType === "ident" || node.firstChild.nextSibling?.nextSibling?.grammarType === ":"))){
            build_error_display(node, editeur, "error in premise the syntax for a rule is either \n []-->[] \n or \n []--[]->[]")
        }
        else if(node.firstChild?.grammarType === "pre_defined"){
            build_error_display(node, editeur, "missing generalized quantifier");
        }
        else if (node.firstChild?.grammarType === "nested_formula" || node.firstChild?.grammarType === "action_constraint" || node.firstChild?.grammarType === "conjunction"){
            build_error_display(node, editeur, "expecting '&', '∧', '|', '∨', '==>'");
        }
        else {
            build_error_display(node, editeur, node.toString().slice(1,-1));
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
                let existingDiag = diags.find(d => d.range.contains(positionStart)); 
                if (!existingDiag) {
                    diags.push(new vscode.Diagnostic(new vscode.Range(positionStart, positionStart.translate(0,0) ), node.toString().slice(1, -1), vscode.DiagnosticSeverity.Error));
                }
            }
            else {
            build_error_display(node, editeur ,node.toString().slice(1,-1));
            }
        }
        else if (node.isError){
            if (node.firstChild && node.firstChild.grammarType === "multi_comment") {
                const childNode = node.child(1);
                if (childNode) {
                  typesOfError(childNode, editeur);
                }
            } 
            else {
                typesOfError(node, editeur);
            }

            diagnostics.set(editeur.document.uri, diags);
            return;
        }
        for (let child of node.children) {
            findMatches(child,editeur);
        }
        
    }

    findMatches(tree.rootNode,editor);

    diagnostics.set(editor.document.uri, diags);
    
}

export function display_syntax_errors(context: vscode.ExtensionContext) {
    const changed_content = vscode.workspace.onDidChangeTextDocument((event) => {
        vscode.window.visibleTextEditors.forEach((editor) => {
            if (event.document === editor.document) {
                detect_errors(editor);
            }
        });
    });

    // Appeler les fonctions du plugin pour tous les éditeurs visibles
    vscode.window.visibleTextEditors.forEach((editor) => {
        detect_errors(editor);
    });

    context.subscriptions.push(changed_content, diagnostics);
}





