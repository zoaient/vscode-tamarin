import { TextDocument } from "vscode-languageserver-textdocument";
import { detect_errors } from "./features/syntax_errors";   
import { Diagnostic } from "vscode-languageserver-types";
import path = require('path');
import Parser =require( "web-tree-sitter");
import { CreateSymbolTableResult ,TamarinSymbol,TamarinSymbolTable,createSymbolTable } from "./symbol_table/create_symbol_table";
import { checks_with_table } from "./features/wellformedness_checks";





export class AnalysisManager{
    private parser: Parser|undefined;
    private symbolTable: Map<string, TamarinSymbolTable>;

    constructor() {
        this.symbolTable = new Map<string, TamarinSymbolTable>();
    }

    public async initParser(parserPath: string): Promise<void> {
        await Parser.init();
        this.parser = new Parser();
        console.log("Parser path:", parserPath);
        const Tamarin = await Parser.Language.load(parserPath);
        this.parser.setLanguage(Tamarin);
        console.log("Parser initialized with Tamarin language.");
    }


    public async AnalyseDocument(document: TextDocument): Promise<Diagnostic[]> {
        if (!this.parser) {
            throw new Error("Parser not initialized");
        }
        const tree =  this.parser.parse(document.getText());
        const text = document.getText();
        const {diagnostics: syntaxDiagnostics } = await detect_errors(tree.rootNode,document);
        const { symbolTable, diags: symbolTableChecks } = await createSymbolTable(tree.rootNode, document);
        this.symbolTable.set(document.uri, symbolTable);
        const wellformednessDiagnostics = await checks_with_table(symbolTable, document, tree.rootNode);
        
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


}
