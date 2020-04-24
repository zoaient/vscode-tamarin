import * as vscode from 'vscode';
import * as child_process from 'child_process';
export function activate(context: vscode.ExtensionContext) {

    console.log('Tamarin extension is now active');
    let stderrOut = vscode.window.createOutputChannel("stderrTamarin");
    let terminal = vscode.window.createTerminal("serverTamarin");
    
    var checkSyntaxCommand = vscode.commands.registerCommand('tamarin.checkSyntax', () => {
        if (vscode.window.activeTextEditor){
            let source = vscode.window.activeTextEditor.document.uri.fsPath;
            let program = "tamarin-prover";
            let args = ["--parse-only", source];
            let result = child_process.spawnSync(program, args);
            if (result.status !== 0) {
                if (result.stderr.length > 0) {
                        let escaped_output = result.stderr.toString();
                        stderrOut.append(escaped_output);
                        stderrOut.show();
                    }
                vscode.window.showErrorMessage("Syntax errors detected");
            }
            else {
                stderrOut.append("No error detected\n");
                vscode.window.showInformationMessage("Syntax is correct");
            }
        }
        
    });

    var checkSemanticsCommand = vscode.commands.registerCommand('tamarin.checkSemantics', () => {
        if (vscode.window.activeTextEditor){
            let source = vscode.window.activeTextEditor.document.uri.fsPath;
            let program = "tamarin-prover";
            let args = ["--quit-on-warning", source];
            let result = child_process.spawnSync(program, args);
            if (result.status !== 0) {
                if (result.stderr.length > 0) {
                        let escaped_output = result.stderr.toString();
                        stderrOut.append(escaped_output);
                        stderrOut.show();
                    }
                vscode.window.showErrorMessage("Semantic errors detected.");
            }
            else {
                stderrOut.append("No error detected\n");
                vscode.window.showInformationMessage("Semantics is correct");
            }
        }
        
    });

    var runServerCommand = vscode.commands.registerCommand('tamarin.runServer', () => {
        if (vscode.window.activeTextEditor){
            let source = vscode.window.activeTextEditor.document.uri.fsPath;
            let program = "tamarin-prover";
            let args = ["interactive", "--quit-on-warning", source];
            terminal.sendText(program + " " + args.join(' '), true);
            terminal.show();
        }
        
    });

    context.subscriptions.push(checkSyntaxCommand);
    context.subscriptions.push(checkSemanticsCommand);
    context.subscriptions.push(runServerCommand);
}