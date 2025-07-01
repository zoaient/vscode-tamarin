import { TextDocument } from "vscode-languageserver-textdocument";
import { detect_errors } from "./features/syntax_errors";   
import { Diagnostic } from "vscode-languageserver-types";
import path = require('path');
import Parser =require( "web-tree-sitter");
import { CreateSymbolTableResult ,createSymbolTable } from "./symbol_table/create_symbol_table";
import { checks_with_table } from "./features/wellformedness_checks";

export let symbolTables = new Map<string, CreateSymbolTableResult>();

export async function AnalyseDocument(document: TextDocument): Promise<Diagnostic[]> {
    const { tree, diagnostics: syntaxDiagnostics } = await detect_errors(document);
    const { symbolTable, diags: symbolTableChecks } = await createSymbolTable(tree, document);
    symbolTables.set(document.uri, { symbolTable });
    const wellformednessDiagnostics = await checks_with_table(symbolTable, document, tree);
    console.log("Symbol table created for:", document.uri);
    console.log("Number of symbols found:", symbolTable.getSymbols().length);
    console.log("Symbol Table content:", symbolTable);
    console.log("Wellformedness diagnostics:", wellformednessDiagnostics.length);
    const allDiagnostics = [
        ...syntaxDiagnostics,
        ...wellformednessDiagnostics,
        ...symbolTableChecks
    ];
    
    return allDiagnostics;
}


/*
export async function AnalyseDocument(document: TextDocument): Promise<Diagnostic[]> {
    const {diagnostics} = await detect_errors(document);
    await initSymbolTable(document)
    console.log("Symbol Tables:", symbolTables);
    return diagnostics;
}




async function init_parser(): Promise<Parser> { // a n'executer qu'une seule fois apres le lancement du serveur , TODO 
    await Parser.init();
    const parser = new Parser();
    const parserPath = path.join(__dirname, 'grammar', 'tree-sitter-tamarin', 'tree-sitter-spthy.wasm'); //Charge la grammaire tree-sitter pour parser
    const Tamarin =  await Parser.Language.load(parserPath);    
    parser.setLanguage(Tamarin);
    return parser;
}



async function initSymbolTable(document: TextDocument): Promise<CreateSymbolTableResult> {
    const parser = await init_parser();
    const tree = parser.parse(document.getText());
    const root = tree.rootNode;
    const symbolTable = await createSymbolTable(root, document);
    symbolTables.set(document.uri, symbolTable);
    return symbolTable;
}
*/