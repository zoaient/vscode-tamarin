import * as vscode from 'vscode';
import { symbolTables } from './syntax_errors';
import { DeclarationType, TamarinSymbol } from '../symbol_table/create_symbol_table';
import { get_symbol } from './rename';

let currentIndex: number = 0;
let similar_symbols: TamarinSymbol[] | undefined;
let activeEditor: vscode.TextEditor | undefined;
let decoration: vscode.TextEditorDecorationType | undefined;

function navigateToNextSymbol() {
    if (!similar_symbols || !activeEditor || !decoration) {
        return;
    }

    currentIndex = (currentIndex + 1) % similar_symbols.length;
    const nextSymbol = similar_symbols[currentIndex];
    const nextSymbolRange = new vscode.Range(
        new vscode.Position(nextSymbol.node.startPosition.row, nextSymbol.node.startPosition.column),
        new vscode.Position(nextSymbol.node.endPosition.row, nextSymbol.node.endPosition.column)
    );
    activeEditor.selection = new vscode.Selection(nextSymbolRange.start, nextSymbolRange.end);
    activeEditor.revealRange(nextSymbolRange, vscode.TextEditorRevealType.InCenter);
}

export function go_to_definition_command(context: vscode.ExtensionContext) {
    const provide_go_toCodeAction = vscode.commands.registerCommand("Search definition", async () => {
        activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage("No active text editor");
            return;
        }

        const activeFile = activeEditor.document.uri.path.split('/').pop();
        if (activeFile) {
            const symbolTable = symbolTables.get(activeFile);
            if (!symbolTable) {
                vscode.window.showErrorMessage("No symbol table for this file");
                return;
            }

            // Find the word that is right clicked
            const position = activeEditor.selection.active;
            const line = activeEditor.document.lineAt(position.line);
            const text = line.text;
            let wordStart = position.character;
            while (wordStart > 0 && /[a-zA-Z0-9_-]/.test(text.charAt(wordStart - 1))) {
                wordStart--;
            }
            let wordEnd = position.character;
            while (wordEnd < text.length && /[a-zA-Z0-9_-]/.test(text.charAt(wordEnd))) {
                wordEnd++;
            }
            const word = text.slice(wordStart, wordEnd);

            //Find the symbol corresponding
            const startPos = new vscode.Position(position.line, wordStart);
            const endPos = new vscode.Position(position.line, wordEnd + (wordEnd === text.length ? 1 : 0));
            const range = new vscode.Range(startPos, endPos);
            const corresponding_symbol = get_symbol(range, symbolTable.symbolTable)

            similar_symbols = []
            for (let symbol of symbolTable.symbolTable.getSymbols()) {
                if (symbol.name === corresponding_symbol?.name && (corresponding_symbol?.declaration === DeclarationType.ActionF || corresponding_symbol?.declaration === DeclarationType.LinearF || corresponding_symbol?.declaration === DeclarationType.PersistentF || corresponding_symbol?.declaration === DeclarationType.Lemma || corresponding_symbol?.declaration === DeclarationType.Rule )) {
                    similar_symbols.push(symbol)
                }
                else if (symbol.name === corresponding_symbol?.name && corresponding_symbol?.declaration === DeclarationType.NARY){
                    similar_symbols.push(symbol);
                    break;
                }
            }

            // Create decoration type for similar symbols
            decoration = vscode.window.createTextEditorDecorationType({
                textDecoration: 'underline',
                color: '#cccccc'
            });

            // Highlight similar symbols and navigate through them
        if (similar_symbols.length > 0) {
            const decorations = similar_symbols.map(symbol => {
                const symbolRange = new vscode.Range(
                    new vscode.Position(symbol.node.startPosition.row, symbol.node.startPosition.column),
                    new vscode.Position(symbol.node.endPosition.row, symbol.node.endPosition.column)
                );
                return { range: symbolRange, hoverMessage: symbol.name };
            });

            // Show the first symbol and highlight all similar symbols
            const firstSymbol = similar_symbols[0];
            const firstSymbolRange = new vscode.Range(
                new vscode.Position(firstSymbol.node.startPosition.row, firstSymbol.node.startPosition.column),
                new vscode.Position(firstSymbol.node.endPosition.row, firstSymbol.node.endPosition.column)
            );
            activeEditor.selection = new vscode.Selection(firstSymbolRange.start, firstSymbolRange.end);
            activeEditor.revealRange(firstSymbolRange, vscode.TextEditorRevealType.InCenter);
            activeEditor.setDecorations(decoration, decorations);


            // Clear the decorations when the selection changes or when the text editor is deactivated
            const selectionChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
                if(activeEditor && decoration)
                if (event.document === activeEditor.document) {
                    activeEditor?.setDecorations(decoration, []);
                }
                
            });
            context.subscriptions.push(selectionChangeListener);

            const activeEditorChangeListener = vscode.window.onDidChangeActiveTextEditor(editor => {
                if(decoration)
                if (!editor || editor !== activeEditor) {
                    activeEditor?.setDecorations(decoration, []);
                }
            });
            context.subscriptions.push(activeEditorChangeListener);

            // Register command to navigate to the next symbol
            const navigateToNextSymbolCommand = vscode.commands.registerCommand('myExtension.navigateToNextSymbol', () => {
                navigateToNextSymbol();
                
            });
            context.subscriptions.push(navigateToNextSymbolCommand);

            // Bind tab key to navigate to the next symbol
            const tabKeyBinding = vscode.commands.registerCommand('extension.tabKeyBinding', () => {
                vscode.commands.executeCommand('myExtension.navigateToNextSymbol');
                
            });
            context.subscriptions.push(tabKeyBinding);
        }
        else{
            vscode.window.showErrorMessage("Not possible for this token")
        }
    }});

    context.subscriptions.push(provide_go_toCodeAction);
}
