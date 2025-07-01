import Parser =require( "web-tree-sitter");
import { Diagnostic , DiagnosticSeverity ,Range , Position} from 'vscode-languageserver';
import { TextDocument } from "vscode-languageserver-textdocument";

//given an node returns his index in his father's children list 
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
// Get the text corresponding to a node range 
export function getName(node : Parser.SyntaxNode| null, document: TextDocument): string {
    if (node && node.isNamed) {
        return document.getText(Range.create(
            document.positionAt(node.startIndex),
            document.positionAt(node.endIndex)
        ));
    } else {
        return "None";
    }
}


/* Function used to detect syntax errors sent by the parser with MISSING or ERROR nodes,
I tried to personnalize error messages according to the different cases
I did the most common ones*/
export async function detect_errors(tree:Parser.SyntaxNode,document: TextDocument): Promise<{diagnostics: Diagnostic[] }> {
    let diags: Diagnostic[] = [];
    function build_error_display(node: Parser.SyntaxNode, message: string) {
        const start = document.positionAt(node.startIndex);
        const end = document.positionAt(node.endIndex > node.startIndex ? node.endIndex : node.startIndex + 1);
        diags.push({
            range: Range.create(start, end),
            message,
            severity: DiagnosticSeverity.Error,
            source: "tamarin"
        });
    }
    // This is where i tried to detect particular cases for syntax errors based on nodes position 
    function typesOfError(node : Parser.SyntaxNode){
        if(node.grammarType === 'theory' || node.nextSibling?.nextSibling?.grammarType === 'begin' || node.nextSibling?.grammarType === 'begin'){
            build_error_display(node, "MISSING 'theory' or 'begin'")

        }
        else if(node.firstChild?.grammarType === "builtins" || node.firstChild?.grammarType === "functions" || node.firstChild?.grammarType === "macros" ){
            build_error_display(node, "MISSING ':' ");
        }
        else if ( node.nextSibling?.grammarType === 'built_in'){
            build_error_display(node, "MISSING ',' ");   
        }
        else if(node.firstChild?.grammarType === "rule" && (node.firstChild.nextSibling?.grammarType != "ident" || node.firstChild.nextSibling?.nextSibling?.grammarType != ":") ){
            build_error_display(node, "MISSING ':' or rule name ");
        }
        else if(node.firstChild?.grammarType === "lemma"){
            build_error_display(node, "MISSING ':' or lemma name ");
        }
        else if (node.firstChild?.grammarType === "premise" || (node.firstChild?.grammarType === "rule" && (node.firstChild.nextSibling?.grammarType === "ident" || node.firstChild.nextSibling?.nextSibling?.grammarType === ":"))){
            build_error_display(node, "ERROR in rule structure the syntax for a rule is either \n []-->[] \n or \n []--[]->[]")
        }
        else if(node.firstChild?.grammarType === "pre_defined"){
            build_error_display(node, "MISSING generalized quantifier");
        }
        else if (node.firstChild?.grammarType === "nested_formula" || node.firstChild?.grammarType === "action_constraint" || node.firstChild?.grammarType === "conjunction"){
            build_error_display(node, "EXPECTING '&', '∧', '|', '∨', '==>'");
        }
        else {
            build_error_display(node, node.toString().slice(1,-1));
        }
    }

    function rangeContains(range: Range, pos: Position): boolean {
        if (pos.line < range.start.line || pos.line > range.end.line) return false;
        if (pos.line === range.start.line && pos.character < range.start.character) return false;
        if (pos.line === range.end.line && pos.character > range.end.character) return false;
    return true;
}
    function findMatches(node : Parser.SyntaxNode) {
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
                let positionStart = document.positionAt(start?? 0);
                const range = Range.create(positionStart, Position.create(positionStart.line, positionStart.character + 1));
                const existingDiag = diags.find(d => rangeContains(d.range, positionStart));
                if (!existingDiag) {
                    diags.push({
                        range,
                        message: node.toString().slice(1, -1),
                        severity: DiagnosticSeverity.Error,
                        source: "tamarin"
                    });
                }
            }
            else {
            build_error_display(node ,node.toString().slice(1,-1));
            }
        }
        else if (node.isError){
            if (node.firstChild && node.firstChild.grammarType === "multi_comment") {
                const childNode = node.child(1);
                if (childNode) {
                  typesOfError(childNode);
                }
            } 
            else {
                typesOfError(node);
            }
            return;
        }
        else if (node.grammarType === 'end'){
        const endPosition = document.positionAt(node.endIndex);
        const endOfDocumentPosition = document.positionAt(document.getText().length);
        const unreachableRange = Range.create(endPosition, endOfDocumentPosition);
        let hasContentAfterEnd = false;
        const text = document.getText();
        let inMultiLineComment = false;
        for (let lineNum = endPosition.line + 1; lineNum <= endOfDocumentPosition.line; lineNum++) {
            const line = text.split('\n')[lineNum];
            if (!inMultiLineComment) {
                if (line.trim().startsWith('/*')) {
                    inMultiLineComment = true;
                } else if (line.trim() !== '' && !line.trim().startsWith('//')) {
                    hasContentAfterEnd = true;
                    break;
                }
            } else {
                if (line.trim().endsWith('*/')) {
                    inMultiLineComment = false;
                }
            }
        }
        if (hasContentAfterEnd) {
            const message = "Code unreachable";
            const severity = DiagnosticSeverity.Warning;
            diags.push({
                range: unreachableRange,
                message,
                severity,
                source: "tamarin"
            });
        } 
        }
        // Iterate over all the AST
        for (let child of node.children) {
            findMatches(child);
        }
    }
    findMatches(tree);
    return {diagnostics: diags };
}
