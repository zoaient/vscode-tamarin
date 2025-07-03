import { TextDocument } from "vscode-languageserver-textdocument";
import { detect_errors } from "./features/syntax_errors";   
import { Diagnostic ,Position, Location,WorkspaceEdit,TextEdit} from "vscode-languageserver-types";
import Parser =require( "web-tree-sitter");
import {TamarinSymbolTable,createSymbolTable} from "./symbol_table/create_symbol_table";
import { checks_with_table } from "./features/checks/index";
import { DeclarationType} from "./symbol_table/tamarinTypes";
//TODO : REFACTORING
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
    //error and warning display
    public async AnalyseDocument(document: TextDocument): Promise<Diagnostic[]> {
        if (!this.parser) {
            throw new Error("Parser not initialized");
        }
        const tree =  this.parser.parse(document.getText());
        const {diagnostics: syntaxDiagnostics } = await detect_errors(tree.rootNode,document);
        const { symbolTable, diags: symbolTableChecks } = await createSymbolTable(tree.rootNode, document);
        this.symbolTable.set(document.uri, symbolTable);
        const wellformednessDiagnostics = await checks_with_table(symbolTable, document, tree.rootNode);
        console.log("Symbol table created for:", document.uri);
        console.log("Number of symbols found:", symbolTable.getSymbols().length);
        console.log("Wellformedness diagnostics:", wellformednessDiagnostics.length);
        const allDiagnostics = [
            ...syntaxDiagnostics,
            ...wellformednessDiagnostics,
            ...symbolTableChecks
        ];
        return allDiagnostics;
    }
    //goto
    public getDefinition(document: TextDocument, position: Position): Location | null {
        if(!this.parser) {
            throw new Error("Parser not initialized");
            return null;
        }
        const table = this.symbolTable.get(document.uri);
        if (!table) {
            console.error(`No symbol table found for document: ${document.uri}`);
            return null;
        }
        const tree= this.parser.parse(document.getText());
        const point = {row: position.line, column: position.character};
        const nodeAtcursor = tree.rootNode.descendantForPosition(point);
        if (!nodeAtcursor) {
            console.error(`No node found at position: ${point.row}, ${point.column}`);
            return null;
        }
        const symbolName = nodeAtcursor.text;
        console.error('[Server] Looking for symbol "${symbolName}" in symbol table.');
        const symbol = table.getSymbols().find(sym => sym.name === symbolName);
        if (symbol && symbol.name_range) {
            console.error(`[Server] getDefinition: Found symbol definition for "${symbol.name}".`);
            const location: Location = {
                uri: document.uri,
                range: symbol.name_range

            };
            return location
        }
        console.error(`[Server] getDefinition: Symbol "${symbolName}" not found in symbol table.`);
        return null;

    }

    public handleDocumentClose(uri: string): void {
        console.log(`Document closed: ${uri}. Cleaning up symbol table.`);
        this.symbolTable.delete(uri);
    }
    //rename
    public handleRenameRequest(document: TextDocument, position: Position, newName: string): WorkspaceEdit | null {
        const table = this.symbolTable.get(document.uri);
        if (!table) return null
        if (!this.parser) {
            throw new Error("Parser not initialized");
        }
        const tree = this.parser.parse(document.getText());
        const point = {row: position.line, column: position.character};
        const nodeAtCursor = tree.rootNode.descendantForPosition(point);
        if (!nodeAtCursor) {
            console.error(`No node found at position: ${point.row}, ${point.column}`);
            return null;
        }
        const oldname= tree.rootNode.namedDescendantForPosition(point).text;
        console.error(oldname);
        const originalSymbol = table.getSymbols().find(symbol => 
            symbol.name === oldname && 
            symbol.name_range && 
            symbol.name_range.start.line === position.line && 
            symbol.name_range.start.character === position.character
        );
        console.error(`[Server] handleRenameRequest: Looking for symbol at position ${position.line}:${position.character}.`);
        console.error(`[Server] handleRenameRequest: Original symbol found: ${originalSymbol ? originalSymbol.name : 'none'}.`);
        if (!originalSymbol) return null;
        const edits: TextEdit[] = [];
        const chosenSymbolName = originalSymbol.name;
        for (const symbol of table.getSymbols()) {
            console.error(symbol.name)
            let shouldRename=false;
            if (symbol.declaration === DeclarationType.PRVariable ||
                symbol.declaration === DeclarationType.ActionFVariable ||
                symbol.declaration === DeclarationType.CCLVariable
            ){
                if (originalSymbol.context === symbol.context && chosenSymbolName === symbol.name) {
                    shouldRename = true;
                }
            }
            else if( symbol.declaration === DeclarationType.LemmaVariable){
                if (symbol.associated_qf?.id === originalSymbol.associated_qf?.id && symbol.name === chosenSymbolName) {
                    shouldRename = true;
                }
            }
            else if (symbol.declaration === DeclarationType.LEquationVariable || 
                     symbol.declaration === DeclarationType.REquationVariable ||
                     symbol.declaration === DeclarationType.LMacroVariable ||
                     symbol.declaration === DeclarationType.RMacroVariable) {
                if (originalSymbol.context.id === symbol.context.id && chosenSymbolName === symbol.name) {
                    shouldRename = true;
                }
            }
            else if (symbol.name === chosenSymbolName && symbol.declaration === originalSymbol.declaration) { 
                shouldRename = true;
            }
            console.error(shouldRename)
            if (shouldRename) {
                if (symbol.name_range) {
                    edits.push(TextEdit.replace(symbol.name_range, newName));
                }
            }
        }
        console.error(edits)
        if (edits.length === 0){
            return null;
        }
        const workspaceEdit: WorkspaceEdit = {
            changes: {
                [document.uri]: edits
            }
        };
        return workspaceEdit;
    }
    
}
