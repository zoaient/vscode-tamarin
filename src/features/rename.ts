import * as vscode from 'vscode'
import { symbolTables } from './syntax_errors';
import { DeclarationType, TamarinSymbol, TamarinSymbolTable } from '../symbol_table/create_symbol_table';

export function get_symbol(range : vscode.Range, symbol_table : TamarinSymbolTable): TamarinSymbol|null{
    for (let k = 0 ; k < symbol_table.getSymbols().length; k++){
        if(symbol_table.getSymbol(k).name_range.isEqual(range)){
            return symbol_table.getSymbol(k);
        }
    }
    return null;
}

async function replace_symbol(symbol : TamarinSymbol, editor : vscode.TextEditor, newName : string ){
  if (symbol.name === undefined) {
    console.error("Cannot replace symbol with undefined name");
    return;
  }
  const range = symbol.name_range;
  const nodeText = editor.document.getText(range);
  const oldNameLength = symbol.name.length;
  const newText = nodeText.replace(symbol.name, newName);
  const newNameLength = newName.length;
  const newRange = new vscode.Range(
    range.start,
    editor.document.positionAt(editor.document.offsetAt(range.start) + newNameLength)
  );
  const edit = new vscode.WorkspaceEdit();
  edit.replace(editor.document.uri, range, newText);
  await vscode.workspace.applyEdit(edit);
  symbol.name_range = newRange;
  symbol.name = newName;
  // Mettre à jour la position de fin du symbole en utilisant la longueur du nouveau nom et la longueur de l'ancien nom
  const delta = newNameLength - oldNameLength;
  symbol.name_range = new vscode.Range(
    symbol.name_range.start,
    symbol.name_range.end.translate(0, delta)
  );
}


export function RenameCommand(context : vscode.ExtensionContext){

    const  provideRenameCodeAction = vscode.commands.registerCommand("Rename", async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage("No active text editor");
            return;
        }

        const activeFile = activeEditor.document.uri.path.split('/').pop(); 
        if(activeFile){
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

        

        const newName = await vscode.window.showInputBox({
            placeHolder: "Enter the new name"
        });
        if (!newName) {
            vscode.window.showErrorMessage("No new name provided");
            return;
        }


        let replace_count: number = 0;
        for(let k = 0 ; k < symbolTable.symbolTable.getSymbols().length ; k++){
            let current_symbol = symbolTable.symbolTable.getSymbol(k);
            if(current_symbol.declaration === DeclarationType.PRVariable || current_symbol.declaration === DeclarationType.ActionFVariable || current_symbol.declaration === DeclarationType.CCLVariable){
                if(corresponding_symbol?.context === current_symbol.context && corresponding_symbol?.name === current_symbol.name){
                    replace_count ++
                    replace_symbol(current_symbol, activeEditor, newName);
                } 
            }
            else if (current_symbol.declaration === DeclarationType.LemmaVariable){
                if(current_symbol.associated_qf?.id === corresponding_symbol?.associated_qf?.id && current_symbol.name === corresponding_symbol?.name){
                    replace_count ++
                    replace_symbol(current_symbol, activeEditor, newName);
                }
            }
            else if( current_symbol.name === corresponding_symbol?.name && current_symbol.declaration === corresponding_symbol?.declaration){
                replace_count ++
                replace_symbol(current_symbol, activeEditor, newName);
            }
        }

        if(replace_count === 0){
            vscode.window.showErrorMessage("No such token");
        }
        
        }
    });

    context.subscriptions.push(provideRenameCodeAction);
}

