import * as vscode from 'vscode'
import Parser = require("web-tree-sitter");
import {getName} from '../features/syntax_errors'
import { check_rule } from '../features/wellformedness_checks';

export type CreateSymbolTableResult = {
    symbolTable: TamarinSymbolTable
};

let diagCollection = vscode.languages.createDiagnosticCollection('Tamarin');
export const createSymbolTable = (root : Parser.SyntaxNode, editor :vscode.TextEditor): CreateSymbolTableResult => {
    let diags: vscode.Diagnostic[] = []; 
    const symbolTableVisitor = new SymbolTableVisitor();
    return {symbolTable: symbolTableVisitor.visit(root, editor, diags)};
};

export enum DeclarationType{
    Arguments = 'arguments',
    Variable = 'variable',

    Builtins = 'built_ins',
    Functions = 'functions',
    QF = 'quantified_formula',
    Let  = 'let',
    ActionF = 'action_fact',
    Conclusion = 'conclusion',


    Lemma = 'lemma',
    Rule = 'rule',
    Theory = 'theory',
    PubVar = 'pub_var',
    MVONF = 'msg_var_or_nullary_fun',
    TMPV = 'temporal_var',
    FUNCP = 'function_pub',
    Builtin = 'built_in',
    LinearF = 'linear_fact',
    PersistentF =  'persistent_fact', 
};

export const ReservedFacts: string[] = ['Fr','In','Out','KD','KU','K'] ;

const ExistingBuiltIns : string[] = 
[
    'diffie-hellman',
    'hashing',
    'symmetric-encryption',
    'asymmetric-encryption',
    'signing',
    'revealing-signing',
    'bilinear-pairing',
    'xor',
]

//First the name and then the arity 
const AssociatedFunctions: string[][] = 
[
['inv','1', '1', '0'],
['h', '1'],
['sdec', '2', 'senc', '2'],
['aenc', '2', 'adec', '2', 'pk', '1'],
['sign', '2', 'verify', '3', 'pk', '1'],
['revealSign', '2', 'revealVerify', '3', 'getMessage', '1', 'pk', '1'],
['pmult', '1', 'em', '2'],
[' XOR', '2', 'zero', '0'],
]



class SymbolTableVisitor{
    constructor(
    private readonly symbolTable : TamarinSymbolTable = new TamarinSymbolTable() ,
    private context: undefined | Parser.Tree = undefined){
        this.context = context
    };
    
    protected defaultResult(): TamarinSymbolTable {
        return this.symbolTable;
    };

    
    public visit(root : Parser.SyntaxNode, editor : vscode.TextEditor, diags: vscode.Diagnostic[]): TamarinSymbolTable{
        for (let i = 0; i < root.children.length; i++){
            const child = root.child(i);
            if(child?.grammarType === DeclarationType.Lemma && root.grammarType === 'lemma' && root.parent !== null){
                this.registerident(root, DeclarationType.Lemma, getName(child?.nextSibling, editor), root.parent)
            }
            else if (child?.grammarType === DeclarationType.Rule && root.grammarType === 'simple_rule' && root.parent !== null){
                this.registerident(root, DeclarationType.Rule, getName(child.nextSibling, editor), root.parent)
                check_rule(root, editor, diags);
            }
            else if (child?.grammarType === DeclarationType.QF){
                for (let grandchild of child.children)
                    if(grandchild.grammarType ===  DeclarationType.MVONF){
                        this.registerident(grandchild, DeclarationType.Variable, getName(grandchild.child(0), editor), child);
                    }
                    else if(grandchild.grammarType === DeclarationType.TMPV){
                        this.registerident(grandchild, DeclarationType.Variable, getName(grandchild.child(1), editor), child);
                    }
                    else if (grandchild.grammarType === 'nested_formula'){
                        this.visit(grandchild, editor, diags)
                    }
            }
            else if(child?.grammarType === DeclarationType.Functions){
                for (let grandchild of child.children){
                    if(grandchild.grammarType === DeclarationType.FUNCP){
                        this.registerfucntion(grandchild, DeclarationType.Functions, getName(grandchild.child(0),editor), parseInt(getName(grandchild.child(2),editor)), root);
                    }
                }
            }
            else if (child?.grammarType === DeclarationType.Builtins){
                let pkcount = 0;
                for (let grandchild of child.children){
                    if(grandchild.grammarType === DeclarationType.Builtin && grandchild.child(0) !== null){
                        const builtinType = grandchild.child(0)?.grammarType ?? '';
                        if(builtinType === 'asymmetric-encryption'||'signing'||'revealing-signing'){ pkcount ++ }
                        this.registerident(grandchild, DeclarationType.Builtin, builtinType, root);
                        const built_in_index = ExistingBuiltIns.indexOf(builtinType);
                        for (let k = 0 ; k < AssociatedFunctions[built_in_index].length; k += 2){
                            if(AssociatedFunctions[built_in_index][k] === 'pk' && pkcount > 1){
                                break;
                            }
                            this.registerfucntion(grandchild, DeclarationType.Functions, AssociatedFunctions[built_in_index][k], parseInt(AssociatedFunctions[built_in_index][k+1]), root);
                        }
                    }
                    
                }
            }
            else if(child?.grammarType === DeclarationType.ActionF){
                for (let grandchild of child.children){
                    if(grandchild.grammarType === DeclarationType.LinearF && grandchild.child(2) !== null ){
                        const args = grandchild.child(2)?.children;
                        if(args){
                            let arity: number = 0;
                            for (let arg of args){
                                if(arg.type === ","){
                                    arity ++;
                                }
                            }
                            arity ++ 
                        this.registerfucntion(child, DeclarationType.ActionF, getName(grandchild.child(0), editor), arity, root)
                    }
                    }
                }
            }
            else if(child?.grammarType === DeclarationType.Conclusion){
                for (let grandchild of child.children){
                    if(grandchild.grammarType === DeclarationType.LinearF || grandchild.grammarType === DeclarationType.PersistentF){
                        const fact_name : string = getName(grandchild.child(0), editor);
                        if(!( ReservedFacts.includes(fact_name))){
                            const args = grandchild.child(2)?.children;
                            if(args){
                                let arity: number = 0;
                                for (let arg of args){
                                    if(arg.type === ","){
                                        arity ++;
                                    }
                                    else if(arg.grammarType === 'pub_var'){

                                    }
                                }
                                arity ++ 
                            this.registerfucntion(child, grandchild.grammarType, getName(grandchild.child(0), editor), arity, root)
                            }
                        }
                    }
                }
            }
            else{
                if(child !== null){
                    this.visit(child, editor, diags);
                }
            }
        }
        diagCollection.set(editor.document.uri, diags)
        return this.symbolTable
    };

    private registerident(ident : Parser.SyntaxNode|null|undefined, declaration: DeclarationType, name : string|undefined,  context ?: Parser.SyntaxNode ){
        if(!ident){
            return;
        }
        this.symbolTable.addSymbol({
            node : ident,
            declaration:  declaration,
            name : name,
            context : context
        });

    };

    private registerfucntion(ident : Parser.SyntaxNode|null|undefined, declaration: DeclarationType, name : string, arity : number,  context ?: Parser.SyntaxNode ){
        if(!ident){
            return;
        }
        this.symbolTable.addSymbol({
            node : ident,
            declaration:  declaration,
            name : name,
            arity : arity,
            context : context
        });

    };

    
};

export type TamarinSymbol = {
    node : Parser.SyntaxNode
    declaration : DeclarationType
    type ?: Parser.SyntaxNode["grammarType"]
    context ?: Parser.SyntaxNode
    name ?:  string 
    arity ?: number
};

export class TamarinSymbolTable{
    private symbols : TamarinSymbol[] = [];

    public addSymbol(symbol: TamarinSymbol) {
        this.symbols.push(symbol);
    }

    public getSymbols(): TamarinSymbol[] {
        return this.symbols;
    }
};
