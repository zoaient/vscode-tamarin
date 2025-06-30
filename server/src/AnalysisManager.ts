import { TextDocument } from "vscode-languageserver-textdocument";
import { detect_errors } from "./features/syntax_errors";   
import { Diagnostic } from "vscode-languageserver-types";
import path = require('path');
import Parser =require( "web-tree-sitter");
import { CreateSymbolTableResult ,createSymbolTable } from "./symbol_table/create_symbol_table";

export let symbolTables = new Map<string, CreateSymbolTableResult>();

export async function AnalyseDocument(document: TextDocument): Promise<Diagnostic[]> {

    const { tree, diagnostics: syntaxDiagnostics } = await detect_errors(document);
    const { symbolTable } = await createSymbolTable(tree, document);
    symbolTables.set(document.uri, { symbolTable });

    // DEBUG : Log au bon moment !
    console.log("Symbol table created for:", document.uri);
    console.log("Number of symbols found:", symbolTable.getSymbols().length);
    console.log("Symbol Table content:", symbolTable); // Décommentez pour voir le contenu

    // --- ÉTAPE 3 : Lancer d'autres checks sémantiques qui utilisent la table ---
    // const semanticErrors = check_other_things(symbolTable, tree);

    // --- ÉTAPE 4 : Centraliser et retourner TOUS les diagnostics ---
    const allDiagnostics = [
        ...syntaxDiagnostics
        // ...semanticErrors
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