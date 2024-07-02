import * as vscode from 'vscode'
import Parser = require("web-tree-sitter");
import { ReservedFacts, DeclarationType, TamarinSymbolTable, TamarinSymbol } from '../symbol_table/create_symbol_table';
import { getName } from './syntax_errors';




function build_error_display(node : Parser.SyntaxNode, editeur: vscode.TextEditor, diags : vscode.Diagnostic[], message : string){
    let start = node.startIndex;
    let end  = node.endIndex;
    let positionStart = editeur.document.positionAt(start);
    let positionEnd = editeur.document.positionAt(end);
    let diag = new vscode.Diagnostic(new vscode.Range(positionStart, positionEnd ), message, vscode.DiagnosticSeverity.Error);
    diags.push(diag)
}

function build_warning_display(node : Parser.SyntaxNode, editeur: vscode.TextEditor, diags : vscode.Diagnostic[], message : string){
    let start = node.startIndex;
    let end  = node.endIndex;
    let positionStart = editeur.document.positionAt(start);
    let positionEnd = editeur.document.positionAt(end);
    let diag = new vscode.Diagnostic(new vscode.Range(positionStart, positionEnd ), message, vscode.DiagnosticSeverity.Warning);
    diags.push(diag)
}

function mostUppercase(str1: TamarinSymbol, str2: TamarinSymbol): TamarinSymbol {
    const countUppercase = (str: string): number => {
      return str.split('').filter(char => char === char.toUpperCase()).length;
    };
    let uppercaseCount1 = 0 ;
    let uppercaseCount2  = 0;
    if(str1.name && str2.name ){
     uppercaseCount1 = countUppercase(str1.name);
     uppercaseCount2 = countUppercase(str2.name);
    }
  
    return uppercaseCount1 > uppercaseCount2 ? str1 : str2;
  }

  function leastUppercase(str1: TamarinSymbol, str2: TamarinSymbol): TamarinSymbol {
    const countUppercase = (str: string): number => {
      return str.split('').filter(char => char === char.toUpperCase()).length;
    };
    let uppercaseCount1 = 0 ;
    let uppercaseCount2  = 0;
    if(str1.name && str2.name ){
     uppercaseCount1 = countUppercase(str1.name);
     uppercaseCount2 = countUppercase(str2.name);
    }
  
    return uppercaseCount1 < uppercaseCount2 ? str1 : str2;
  }

export function check_reserved_facts(node : Parser.SyntaxNode, editor : vscode.TextEditor, diags : vscode.Diagnostic[]){
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

//A optimiser peut être 
function check_variables_type_is_consistent_inside_a_rule(symbol_table : TamarinSymbolTable, editor: vscode.TextEditor, diags:vscode.Diagnostic[]){
    for (let i = 0 ; i < symbol_table.getSymbols().length; i++){
        if(symbol_table.getSymbol(i).declaration === 'premise_variable' || symbol_table.getSymbol(i).declaration === 'conclusion_variable' || symbol_table.getSymbol(i).declaration === 'action_fact_variable' ){
            for(let j = 0; j < symbol_table.getSymbols().length; j++){
                if((symbol_table.getSymbol(i).declaration === 'premise_variable' || symbol_table.getSymbol(i).declaration === 'conclusion_variable' || symbol_table.getSymbol(i).declaration === 'action_fact_variable') && i !== j){
                    if(symbol_table.getSymbol(i).context === symbol_table.getSymbol(j).context && symbol_table.getSymbol(i).name === symbol_table.getSymbol(j).name){
                        if(symbol_table.getSymbol(i).type === symbol_table.getSymbol(j).type){
                            continue;
                        }
                        else{
                            build_error_display(symbol_table.getSymbol(i).node, editor, diags, "Error: Inconsistent variables, variables with the same name in the same rule must have same types ");
                            break;
                        }
                    }
                    else {
                        continue;
                    }
                }
                else{
                    continue;
                }
            }
        }
        else{
            continue;
        }
    }
};

function check_case_sensitivity(symbol_table : TamarinSymbolTable, editor: vscode.TextEditor, diags: vscode.Diagnostic[]){
    const facts : TamarinSymbol[]  = [];
    let k = 0;
    for( let i = 0 ; i < symbol_table.getSymbols().length; i++){
        if(symbol_table.getSymbol(i).declaration === DeclarationType.LinearF || symbol_table.getSymbol(i).declaration === 
        DeclarationType.PersistentF ||  symbol_table.getSymbol(i).declaration === DeclarationType.ActionF ){
            const name  = symbol_table.getSymbol(i).name;
            if(name){
                //Checks if fact name is correct -------
                if(!(name.charCodeAt(0) >= 65  && name.charCodeAt(0) <= 90)){
                    build_error_display(symbol_table.getSymbol(i).node, editor, diags, "Error: Facts must start with an uppercase")
                }
                //---------
                for( let j = 0; j < facts.length ; j++ ){
                    const name2 = facts[j].name;
                    if(  name2 === name ){
                        continue;
                    }
                    else if (name2?.toLowerCase() === name.toLowerCase()){
                        let mu = mostUppercase(symbol_table.getSymbol(i), facts[j]);
                        let lu = leastUppercase(symbol_table.getSymbol(i), facts[j]);
                        build_warning_display(mu.node, editor, diags, "Warning: Facts are case sensitive, did you intend to use " + 
                        lu.name)
                        k++;
                        break;
                    }
                }
            }
            facts.push(symbol_table.getSymbol(i));
            if(k > 0 ){break;};
        }
    };

};


function check_variable_is_defined_in_premise(symbol_table : TamarinSymbolTable, editor: vscode.TextEditor, diags: vscode.Diagnostic[]){
    for( let i = 0 ; i < symbol_table.getSymbols().length; i++){
        let current_symbol = symbol_table.getSymbol(i);
        if(current_symbol.type === '$'){continue};  // Do not take into account public variables
        if(current_symbol.declaration === DeclarationType.CCLVariable){
            let current_context = current_symbol.context;
            let is_break = false;
            for (let j = 0; j < symbol_table.getSymbols().length; j++){
                let searched_symbol = symbol_table.getSymbol(j);
                if(j > i){break};
                if(searched_symbol.context !== current_context || j == i){
                    continue;
                }
                else{
                    if(searched_symbol.name === current_symbol.name){
                        is_break = true
                        break;
                    }
                }
            }
            if(!is_break){
                build_error_display(current_symbol.node, editor, diags, "Error: this variable is used in conclusion but doesn't appear in premise");
            }
        }
    }
}



export function checks_with_table(symbol_table : TamarinSymbolTable, editor: vscode.TextEditor, diags: vscode.Diagnostic[]){
    check_variables_type_is_consistent_inside_a_rule(symbol_table, editor, diags);
    check_case_sensitivity(symbol_table, editor, diags);
    check_variable_is_defined_in_premise(symbol_table, editor, diags);
};