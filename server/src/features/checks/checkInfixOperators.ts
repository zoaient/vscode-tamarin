import Parser = require("web-tree-sitter");
import { DeclarationType, TamarinSymbolTable, TamarinSymbol} from '../../symbol_table/create_symbol_table';
import { getName } from './utils';
import { TextDocument } from "vscode-languageserver-textdocument";
import { Diagnostic , DiagnosticSeverity ,Range} from 'vscode-languageserver';

/* Given a symbol table returns all the builtins present in it */ 
function return_builtins(symbol_table: TamarinSymbolTable): TamarinSymbol[]{
let builtins : TamarinSymbol[]  = [];
    for (let symbol of symbol_table.getSymbols()){
        if(symbol.declaration === DeclarationType.Builtin){
            builtins.push(symbol);
        }
    } 
    return builtins;
}

/* Given a list of builtins returns there name */
function get_builtins_name(builtins : TamarinSymbol[]): string[]{
    let Sbuiltins : string[] = [];
    for (let builtin of builtins ){
        if(builtin.name)
        Sbuiltins.push(builtin.name)
    }
    return Sbuiltins;
}

function return_functions(symbol_table: TamarinSymbolTable): string[]{
    let builtins : string[]  = [];
        for (let symbol of symbol_table.getSymbols()){
            if(symbol.declaration === DeclarationType.Functions && symbol.name){
                builtins.push(symbol.name);
            }
        } 
        return builtins;
    }

/* Function used to check if the use of * ^ or others symbol is allowed, if not provides a quick fix to include the right builtin,
Also works with functions defined in builtins*/ 
export function check_infix_operators(symbol_table : TamarinSymbolTable, editor : TextDocument, root : Parser.SyntaxNode): Diagnostic[]{
    const diags : Diagnostic[] = [];
    function display_infix_error(builtin: string, symbol: string, child: Parser.SyntaxNode): void {
        let current_builtins = return_builtins(symbol_table);
        let current_functions = return_functions(symbol_table)
        if (!get_builtins_name(current_builtins).includes(builtin) && !current_functions.includes(getName(child.child(0), editor))) {
            if(current_builtins.length > 0){
            const diagnostic: Diagnostic = {
                range: current_builtins[current_builtins.length - 1].name_range ,
                message: "Error : symbol " + symbol + " cannot be used without " + builtin + " builtin",
                severity: DiagnosticSeverity.Warning,
                source: "tamarin",
                code: "missingBuiltin"
            };
            diags.push(diagnostic);
            }
            else {
                let theory = root ;
                while (theory.grammarType !== 'theory'){
                    if(theory.parent)
                    theory = theory.parent
                }
                theory = theory.child(3) as Parser.SyntaxNode
                const range = Range.create(
                    editor.positionAt(theory.startIndex),
                    editor.positionAt(theory.endIndex)
                );
            }  
        }
      }
    for (let child of root.children){
        if(child.grammarType === '^' || child.grammarType === '*'){
            let current_builtins = return_builtins(symbol_table);
            if(! get_builtins_name(current_builtins).includes('diffie-hellman')){
                display_infix_error('diffie-hellman', '^ or *', child) 
                }
        }
        else if (child.grammarType === '⊕'){
            display_infix_error('xor','⊕', child);;
        }
        else if (child.grammarType === '++'){
            display_infix_error('multiset', '++', child);;
        }
        else if (child.grammarType === '%+'){
            display_infix_error('natural-numbers', '%+', child);
        }
        else if (child.grammarType === DeclarationType.NARY){
            if(getName(child.child(0),editor) === 'inv'){
                display_infix_error('diffie-hellman', 'inv', child);
            }
            else if (getName(child.child(0),editor) === 'h'){
                display_infix_error('hashing', 'h', child);
            }
            else if (getName(child.child(0), editor) === 'sdec' || getName(child.child(0), editor) === 'senc'){
                display_infix_error('symmetric-encryption', 'sdec or senc' , child);
            }
            else if (getName(child.child(0), editor) === 'adec' || getName(child.child(0), editor) === 'aenc'){
                display_infix_error('asymmetric-encryption', 'adec or aenc' , child);
            }
            else if (getName(child.child(0), editor) === 'sign' || getName(child.child(0), editor) === 'verify'){
                display_infix_error('signing', 'sign or verify' , child);
            }
            else if (getName(child.child(0), editor) === 'revealSign' || getName(child.child(0), editor) === 'revealVerify' || getName(child.child(0), editor) === 'getMessage'){
                display_infix_error('revealing-signing', 'revealSign or revealVerify or getMessage' , child);
            }
            else if (getName(child.child(0), editor) === 'pmult' || getName(child.child(0), editor) === 'em'){
                display_infix_error('bilinear-pairing', 'pmult or em' , child);
            }
            else if (getName(child.child(0),editor) === 'XOR'){
                display_infix_error('xor', 'XOR', child);  
            }
        }
        else (check_infix_operators(symbol_table,editor,child));
    }
    return diags;
}