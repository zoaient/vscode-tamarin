import * as vscode from 'vscode'
import Parser = require("web-tree-sitter");
import {getName} from '../features/syntax_errors'
import { check_reserved_facts, checks_with_table } from '../features/wellformedness_checks';

export type CreateSymbolTableResult = {
    symbolTable: TamarinSymbolTable
};

let diagCollection = vscode.languages.createDiagnosticCollection('Tamarin');
export const createSymbolTable = (root : Parser.SyntaxNode, editor :vscode.TextEditor): CreateSymbolTableResult => {
    let diags: vscode.Diagnostic[] = []; 
    const symbolTableVisitor = new SymbolTableVisitor();
    let symbolTable = symbolTableVisitor.visit(root, editor, diags);
    checks_with_table(symbolTable, editor, diags)
    diagCollection.set(editor.document.uri, diags)
    return {symbolTable};
};

function find_variables(node : Parser.SyntaxNode): Parser.SyntaxNode[]{
    let vars : Parser.SyntaxNode[] = []
    for( let child of node.children){
        if(child.grammarType === 'pub_var' ||child.grammarType === 'fresh_var' || child.grammarType === DeclarationType.MVONF ||child.grammarType === 'nat_var'|| child.grammarType === 'temporal_var'){
            vars.push(child)
            vars = vars.concat(find_variables(child));
        }
        else{
            vars = vars.concat(find_variables(child));
        }
    }  
    return vars;  
}

function find_linear_fact(node : Parser.SyntaxNode): Parser.SyntaxNode[]{
    let vars : Parser.SyntaxNode[] = []
    for( let child of node.children){
        if(child.grammarType === DeclarationType.LinearF || child.grammarType === DeclarationType.NARY){
            vars.push(child)
            vars = vars.concat(find_linear_fact(child));
        }
        else{
            vars = vars.concat(find_linear_fact(child));
        }
    }  
    return vars;  
}

export function get_arity(node : Parser.SyntaxNode[]|undefined): number{
    let arity: number = 0;
    if(node)
    for (let arg of node){
        if(arg.type !== ","){
            arity ++;
        }
    } 
    return arity;
}

export enum DeclarationType{
    Arguments = 'arguments',
    Variable = 'variable',
    CCLVariable = 'conclusion_variable',
    PRVariable = 'premise_variable',
    ActionFVariable = 'action_fact_variable',
    LemmaVariable = 'lemma_variable',

    Builtins = 'built_ins',
    Functions = 'functions',
    QF = 'quantified_formula',
    NF = 'nested_formula',
    Let  = 'let',
    ActionF = 'action_fact',
    Conclusion = 'conclusion',
    Premise = 'premise',


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
    NARY = 'nary_app',
    DEFAULT = 'default'
};
function convert(grammar_type : string) : DeclarationType{
    if(grammar_type === 'nary_app'){return DeclarationType.NARY}
    else if(grammar_type === 'linear_fact'){return DeclarationType.LinearF}
    else{return DeclarationType.DEFAULT};
}

export enum variable_types{
    PUB = '$',
    FRESH = '~',
    NAT = '%',
    TEMP = '#'
}

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
                this.register_facts_searched(root, editor, root, DeclarationType.ActionF);
                this.register_vars_lemma(root, DeclarationType.LemmaVariable, editor)
            }
            else if (child?.grammarType === DeclarationType.Rule && root.grammarType === 'simple_rule' && root.parent !== null){
                this.registerident(root, DeclarationType.Rule, getName(child.nextSibling, editor), root.parent)
                check_reserved_facts(root, editor, diags);
            }
            else if (child?.grammarType === DeclarationType.QF){
               continue;
            }
            else if(child?.grammarType === DeclarationType.NF){
                continue;
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
                            let arity: number = get_arity(args)
                        this.registerfucntion(child, DeclarationType.ActionF, getName(grandchild.child(0), editor), arity, root)
                    }
                    }
                }
                this.register_vars_rule(child, DeclarationType.ActionFVariable, editor, root)        
            }
            else if(child?.grammarType === DeclarationType.Conclusion){
                this.register_facts_searched(child, editor, root);
                this.register_vars_rule(child, DeclarationType.CCLVariable, editor, root)
            }
            else if (child?.grammarType === DeclarationType.Premise){
                this.register_facts_searched(child, editor, root);
                this.register_vars_rule(child, DeclarationType.PRVariable, editor, root);
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

    private register_vars_rule(node :Parser.SyntaxNode, type : DeclarationType, editor : vscode.TextEditor, root : Parser.SyntaxNode){
        let vars: Parser.SyntaxNode[] = find_variables(node);
                for(let k = 0; k < vars.length; k++){
                    if(vars[k].grammarType === DeclarationType.MVONF){
                        this.registerident(vars[k], type, getName(vars[k].child(0), editor),root)
                    }
                    else{
                        this.registerident(vars[k], type, getName(vars[k].child(1), editor),root, vars[k].child(0)?.grammarType)
                    }
                }
    }

    private register_vars_lemma(node :Parser.SyntaxNode, type : DeclarationType, editor : vscode.TextEditor){
        let vars: Parser.SyntaxNode[] = find_variables(node);
        let symbol_for_temp = ['@', '<'];
                for(let k = 0; k < vars.length; k++){
                    let context: Parser.SyntaxNode = vars[k];
                    while(context.grammarType !== DeclarationType.NF  && context.grammarType !== 'conjunction' && context.grammarType !== 'disjunction' && context.grammarType !== DeclarationType.Lemma ){
                        if(context.parent){
                            context = context.parent;
                        }
                    }
                    if(vars[k].parent !== null){
                        if(vars[k].grammarType === DeclarationType.MVONF ||  ( vars[k].previousSibling && vars[k].grammarType === DeclarationType.TMPV  && symbol_for_temp.includes((vars[k].previousSibling as Parser.SyntaxNode).grammarType)) || vars[k].parent?.grammarType === 'temp_var_order'){
                            this.registerident(vars[k], type, getName(vars[k].child(0), editor),context)
                        }
                        else{
                            this.registerident(vars[k], type, getName(vars[k].child(1), editor),context, vars[k].child(0)?.grammarType)
                        }
                    }
                }
    }

    private register_facts_searched(node :Parser.SyntaxNode, editor : vscode.TextEditor, root : Parser.SyntaxNode, type ?: DeclarationType){
        let vars: Parser.SyntaxNode[] = find_linear_fact(node);
        for(let k = 0; k < vars.length; k++){
            if(ReservedFacts.includes(getName(vars[k].child(0),editor))){
                continue;
            }
            if(node.child(2) !== null){
                const args = vars[k].child(2)?.children;
                if(args){
                    let arity: number = get_arity(args);
                if(type){
                    this.registerfucntion(vars[k], type, getName(vars[k].child(0),editor),arity, root);
                }
                else{
                    this.registerfucntion(vars[k], convert(vars[k].grammarType) , getName(vars[k].child(0),editor),arity, root)
                }
                }
            }
        }
    }



    private registerident(ident : Parser.SyntaxNode|null|undefined, declaration: DeclarationType, name : string|undefined,  context : Parser.SyntaxNode, type ?: string ){
        if(!ident){
            return;
        }
        this.symbolTable.addSymbol({
            node : ident,
            declaration:  declaration,
            name : name,
            context : context,
            type : type 
        });

    };

    private registerfucntion(ident : Parser.SyntaxNode|null|undefined, declaration: DeclarationType, name : string, arity : number,  context : Parser.SyntaxNode ){
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
    context ?: Parser.SyntaxNode
    name ?:  string 
    arity ?: number
    type ?: string
};

export class TamarinSymbolTable{
    private symbols : TamarinSymbol[] = [];

    public addSymbol(symbol: TamarinSymbol) {
        this.symbols.push(symbol);
    };

    public getSymbols(): TamarinSymbol[] {
        return this.symbols;
    };

    public getSymbol(int : number):TamarinSymbol{
        return this.symbols[int];
    };
};
