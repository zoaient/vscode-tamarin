import * as vscode from 'vscode';
import * as child_process from 'child_process';

function getTerminal(name: string = "serverTamarin") {
    let target = undefined;

    vscode.window.terminals.forEach(value => {
        if (value.name === name) {
            target = value;
        }
    });

    if (target === undefined) {
        target = vscode.window.createTerminal(name);
    }

    return target;
}



export function activate(context: vscode.ExtensionContext) {

    console.log('Tamarin extension is now active');
    let stderrOut = vscode.window.createOutputChannel("stderrTamarin");
    
    var checkSyntaxCommand = vscode.commands.registerCommand('tamarin.checkSyntax', () => {
        if (vscode.window.activeTextEditor){
            let source = vscode.window.activeTextEditor.document.uri.fsPath;
            vscode.window.activeTextEditor.document.save().then( () => {
                    let program = "tamarin-prover";
                    let args = ["--parse-only", source];
                    let result = child_process.spawnSync(program, args);
                    if (result.status !== 0) {
                        if (result.stderr.length > 0) {
                                let escaped_output = result.stderr.toString();
                                stderrOut.append(escaped_output);
                                stderrOut.show(true);
                            }
                        vscode.window.showErrorMessage("Syntax errors detected");
                    }
                    else {
                        stderrOut.append("No error detected\n");
                        vscode.window.showInformationMessage("Syntax is correct");
                    }
                },() => {
                    vscode.window.showErrorMessage("Error saving source");
                });
            
        }
        
    });

    var checkSemanticsCommand = vscode.commands.registerCommand('tamarin.checkSemantics', () => {
        if (vscode.window.activeTextEditor){
            let source = vscode.window.activeTextEditor.document.uri.fsPath;
            vscode.window.activeTextEditor.document.save().then( () => {
                let program = "tamarin-prover";
                let args = ["--quit-on-warning", source];
                let result = child_process.spawnSync(program, args);
                if (result.status !== 0) {
                    if (result.stderr.length > 0) {
                            let escaped_output = result.stderr.toString();
                            stderrOut.append(escaped_output);
                            stderrOut.show(true);
                        }
                    vscode.window.showErrorMessage("Semantic errors detected.");
                }
                else {
                    stderrOut.append("No error detected\n");
                    vscode.window.showInformationMessage("Semantics is correct");
                }
            }, () => {
                vscode.window.showErrorMessage("Error saving source");
            });
        }
        
    });

    var runServerCommand = vscode.commands.registerCommand('tamarin.runServer', () => {
        if (vscode.window.activeTextEditor){
            let source = "'" + vscode.window.activeTextEditor.document.uri.fsPath + "'";
            vscode.window.activeTextEditor.document.save().then( () => {
                let program = "tamarin-prover";
                let args = ["interactive", "--quit-on-warning", source];
                let terminal = getTerminal();
                terminal.sendText(program + " " + args.join(' '), true);
                terminal.show();
            }, () => {
                vscode.window.showErrorMessage("Error saving source");
            });
        }
        
    });

    var runConsoleProofCommand = vscode.commands.registerCommand('tamarin.runConsoleProofCommand', () => {
        if (vscode.window.activeTextEditor){
            let source = "'" + vscode.window.activeTextEditor.document.uri.fsPath + "'";
            vscode.window.activeTextEditor.document.save().then( () => {
                let timer = "time"
                let program = "tamarin-prover";
                let args = ["--prove", source];
                let terminal = getTerminal();
                terminal.sendText(timer + " " + program + " " + args.join(' '), true);
                terminal.show();
            }, () => {
                vscode.window.showErrorMessage("Error saving source");
            });
        }
        
    });

    context.subscriptions.push(checkSyntaxCommand);
    context.subscriptions.push(checkSemanticsCommand);
    context.subscriptions.push(runServerCommand);
    context.subscriptions.push(runConsoleProofCommand);
}