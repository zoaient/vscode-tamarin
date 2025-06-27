import { TextDocument } from "vscode-languageserver-textdocument";
import { detect_errors } from "./features/syntax_errors";   
import { Diagnostic } from "vscode-languageserver-types";
import path = require('path');
import Parser =require( "web-tree-sitter");

export async function AnalyseDocument(document: TextDocument): Promise<Diagnostic[]> {
    const {diagnostics} = await detect_errors(document);
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