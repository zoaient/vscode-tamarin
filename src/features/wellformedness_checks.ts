import * as vscode from 'vscode'
import Parser = require("web-tree-sitter");
import { ReservedFacts, DeclarationType } from '../symbol_table/create_symbol_table';
import { getName } from './syntax_errors';




function build_error_display(node : Parser.SyntaxNode, editeur: vscode.TextEditor, diags : vscode.Diagnostic[], message : string){
    let start = node.startIndex;
    let positionStart = editeur.document.positionAt(start);
    let diag = new vscode.Diagnostic(new vscode.Range(positionStart, positionStart.translate(0,0) ), message, vscode.DiagnosticSeverity.Error);
    diags.push(diag)
}

function build_warning_display(node : Parser.SyntaxNode, editeur: vscode.TextEditor, diags : vscode.Diagnostic[], message : string){
    let start = node.startIndex;
    let positionStart = editeur.document.positionAt(start);
    let diag = new vscode.Diagnostic(new vscode.Range(positionStart, positionStart.translate(0,0) ), message, vscode.DiagnosticSeverity.Warning);
    diags.push(diag)
}
export function check_rule(node : Parser.SyntaxNode, editor : vscode.TextEditor, diags : vscode.Diagnostic[]){
    check_reserved_facts(node, editor, diags);
    check_variables_type_is_consistent_inside_a_rule(node, editor, diags);
};

function check_reserved_facts(node : Parser.SyntaxNode, editor : vscode.TextEditor, diags : vscode.Diagnostic[]){
    for(let child of node.children){
        if(child.grammarType === DeclarationType.LinearF ||child.grammarType === DeclarationType.PersistentF){
            const fact_name = getName(child.child(0), editor);
            if(fact_name === ReservedFacts[0] && node.grammarType === 'conclusion'){
                build_warning_display(child, editor, diags,  "Fr fact cannot be used in conclusion of a rule");
            }
            else if(fact_name === ReservedFacts[1] && node.grammarType === 'conclusion'){
                build_warning_display(child, editor, diags,  "In fact cannot be used in conclusion of a rule");
            }
            else if(fact_name === ReservedFacts[2] && node.grammarType === 'premise'){
                build_warning_display(child, editor, diags,  "Out fact cannot be used in premise of a rule");
            }
            else if((fact_name === ReservedFacts[3] || fact_name === ReservedFacts[4] || fact_name === ReservedFacts[5]) && node.parent?.grammarType === 'simple_rule' ){
                build_warning_display(child, editor, diags,  "You are not supposed to use KD KU or action K in a rule ");
            }
        }
        else {
            check_reserved_facts(child, editor, diags)
        }
    }
    
};

function check_variables_type_is_consistent_inside_a_rule(node : Parser.SyntaxNode, editor : vscode.TextEditor, diags : vscode.Diagnostic[]){

};