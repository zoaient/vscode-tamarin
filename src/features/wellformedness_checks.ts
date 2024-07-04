import * as vscode from 'vscode'
import Parser = require("web-tree-sitter");
import { ReservedFacts, DeclarationType, TamarinSymbolTable, TamarinSymbol, get_arity } from '../symbol_table/create_symbol_table';
import { getName } from './syntax_errors';
import { glob } from 'glob';




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
            if(fact_name === ReservedFacts[0]){
                if(node.grammarType === 'conclusion'){
                    build_warning_display(child, editor, diags,  "Fr fact cannot be used in conclusion of a rule");
                }
                if( child.child(2)?.children && get_arity(child.child(2)?.children) !== 1){
                    build_error_display(child, editor, diags, "Error: incorrect arity for Fr fact, only 1 argument expected")
                }
            }
            else if(fact_name === ReservedFacts[1]){
                if(node.grammarType === 'conclusion'){
                    build_warning_display(child, editor, diags,  "In fact cannot be used in conclusion of a rule");
                }
                if(child.child(2)?.children && get_arity(child.child(2)?.children) !== 1){
                    build_error_display(child, editor, diags, "Error: incorrect arity for In fact, only 1 argument expected")
                }
            }
            else if(fact_name === ReservedFacts[2]){
                if( node.grammarType === 'premise'){
                    build_warning_display(child, editor, diags,  "Out fact cannot be used in premise of a rule");
                }
                if(child.child(2)?.children && get_arity(child.child(2)?.children) !== 1){
                    build_error_display(child, editor, diags, "Error: incorrect arity for Out fact, only 1 argument expected")
                }
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
                            build_error_display(symbol_table.getSymbol(i).node, editor, diags, "Error: inconsistent variables, variables with the same name in the same rule must have same types ");
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
                    build_error_display(symbol_table.getSymbol(i).node, editor, diags, "Error: facts must start with an uppercase")
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
                        build_warning_display(mu.node, editor, diags, "Warning: facts are case sensitive, did you intend to use " + 
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

function check_action_fact(symbol_table : TamarinSymbolTable, editor: vscode.TextEditor, diags: vscode.Diagnostic[]){
    let actionFacts: TamarinSymbol[] = [];
    for( let i = 0 ; i < symbol_table.getSymbols().length; i++){
        let current_symbol = symbol_table.getSymbol(i);
        if(current_symbol.declaration === DeclarationType.ActionF && current_symbol.context?.grammarType !== 'simple_rule'){
            let found_one = false;
            for(let j = 0; j < actionFacts.length; j++){
                if(actionFacts[j].name === current_symbol.name){
                    found_one = true;
                    if(!(actionFacts[j].arity === current_symbol.arity)){
                        build_error_display(current_symbol.node, editor, diags, "Error, incorrect arity for this action fact")
                    }
                }
                else{
                    continue;
                }
            }
            if(!found_one){
                build_error_display(current_symbol.node, editor, diags, "Error: this action fact is never declared")
            }
        }
        else if (current_symbol.declaration === DeclarationType.ActionF && current_symbol.context?.grammarType === 'simple_rule'){
            actionFacts.push(current_symbol)
        }
        else{
            continue;
        }
    }
}

function check_function_and_facts_arity(symbol_table : TamarinSymbolTable, editor: vscode.TextEditor, diags: vscode.Diagnostic[]){
    let known_functions : TamarinSymbol[] = [];

    function getNames(list : TamarinSymbol[]): string[]{
        let str_list : string[] = [];
        for(let symbol of list){
            if(symbol.name){
                str_list.push(symbol.name);
            }
        }
        return str_list;
    }

    for( let i = 0; i < symbol_table.getSymbols().length; i++){
        let current_symbol = symbol_table.getSymbol(i);
        if(symbol_table.getSymbol(i).declaration === DeclarationType.LinearF || symbol_table.getSymbol(i).declaration === DeclarationType.PersistentF || symbol_table.getSymbol(i).declaration === DeclarationType.Functions || symbol_table.getSymbol(i).declaration === DeclarationType.NARY){
            if(current_symbol.name){
                if(getNames(known_functions).includes(current_symbol.name)){
                    for(let k = 0 ; k < known_functions.length; k ++){
                        if(current_symbol.name === known_functions[k].name ){
                            if(current_symbol.arity === known_functions[k].arity){
                                break;
                            }
                            else{
                                if(current_symbol.declaration === DeclarationType.NARY){
                                    build_error_display(current_symbol.node, editor, diags, "Error : incorrect arity for this function")
                                }
                                else if( current_symbol.declaration === DeclarationType.LinearF){
                                    build_error_display(current_symbol.node, editor, diags, "Error : incorrect arity for this fact")
                                }
                            }
                        }
                        else{
                            continue;
                        }
                    }
                }
                else{
                    known_functions.push(current_symbol)
                }
            }
        }
    }
}

function check_free_term_in_lemma(symbol_table : TamarinSymbolTable, editor: vscode.TextEditor, diags: vscode.Diagnostic[]){
    let lemma_vars : TamarinSymbol[] = [];
    for (let symbol of symbol_table.getSymbols()){
        if(symbol.declaration === DeclarationType.LemmaVariable){
            lemma_vars.push(symbol);
        }
    }
    for( let i = 0; i < lemma_vars.length; i++){
        if(lemma_vars[i].node.parent?.grammarType === DeclarationType.QF){
            continue;
        }
        let context = lemma_vars[i].context;
        let globalisbreak = false;
        while(context?.grammarType !== 'theory'){
            let context_child_id: number[] = [];
            if(context?.children){
                let search_context = context
                while(search_context.child(0)?.grammarType === 'conjunction' || search_context.child(0)?.grammarType === 'disjunction'){
                    if(search_context.child(0)){
                    context_child_id.push((search_context.child(0) as {id:number}).id)
                    search_context = search_context.child(0) as Parser.SyntaxNode
                    } 
                }
            }
            let isbreak = false ;
            for (let j  = 0; j < lemma_vars.length; j++){
                if((lemma_vars[j].context?.id === context?.id || context_child_id.includes((lemma_vars[j].context as {id : number}).id)) && lemma_vars[j].node.parent?.grammarType === DeclarationType.QF && lemma_vars[j].name === lemma_vars[i].name){
                    isbreak = true;
                    break;
                }
                
            }
            if(isbreak){
                globalisbreak = true;
                break;
            }
            else {
                if(context?.parent){
                    context = context?.parent
                }
            }
        }
        if(!globalisbreak){
            build_warning_display(lemma_vars[i].node, editor, diags, "Warning : free term in lemma formula")
        }
    }
}



export function checks_with_table(symbol_table : TamarinSymbolTable, editor: vscode.TextEditor, diags: vscode.Diagnostic[]){
    check_variables_type_is_consistent_inside_a_rule(symbol_table, editor, diags);
    check_case_sensitivity(symbol_table, editor, diags);
    check_variable_is_defined_in_premise(symbol_table, editor, diags);
    check_action_fact(symbol_table, editor, diags);
    check_function_and_facts_arity(symbol_table, editor, diags);
    check_free_term_in_lemma(symbol_table, editor, diags);
};