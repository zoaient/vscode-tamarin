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
    const stderrOut = vscode.window.createOutputChannel("stderrTamarin");
    const checkSyntaxCommand = vscode.commands.registerCommand('tamarin.checkSyntax', () => {
        if (vscode.window.activeTextEditor){
            const source = vscode.window.activeTextEditor.document.uri.fsPath;
            vscode.window.activeTextEditor.document.save().then( () => {
                    const program = "tamarin-prover";
                    const args = ["--parse-only", source];
                    const result = child_process.spawnSync(program, args);
                    if (result.status !== 0) {
                        if (result.stderr.length > 0) {
                                const escaped_output = result.stderr.toString();
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

    const checkSemanticsCommand = vscode.commands.registerCommand('tamarin.checkSemantics', () => {
        if (vscode.window.activeTextEditor){
            const source = vscode.window.activeTextEditor.document.uri.fsPath;
            vscode.window.activeTextEditor.document.save().then( () => {
                const program = "tamarin-prover";
                const args: Array<string> = [];
                const conf = vscode.workspace.getConfiguration('tamarin.parameter');
                if(!conf.get('quitOnWarning')){
                    args.push("--quit-on-warning");
                }
                args.push(source);
                const result = child_process.spawnSync(program, args);
                if (result.status !== 0) {
                    if (result.stderr.length > 0) {
                            const escaped_output = result.stderr.toString();
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

    const runServerCommand = vscode.commands.registerCommand('tamarin.runServer', () => {
        if (vscode.window.activeTextEditor){
            const source = "'" + vscode.window.activeTextEditor.document.uri.fsPath + "'";
            vscode.window.activeTextEditor.document.save().then( () => {
                const program = "tamarin-prover";
                const args: Array<string> = ["interactive"];
                const conf = vscode.workspace.getConfiguration('tamarin.parameter');
                if(!conf.get('quitOnWarning')){
                    args.push("--quit-on-warning");
                }
                if(!conf.get('autoSources')){
                    args.push("--auto-sources");
                }
                args.push(source);
                const terminal = getTerminal();
                terminal.sendText(program + " " + args.join(' '), true);
                terminal.show();
            }, () => {
                vscode.window.showErrorMessage("Error saving source");
            });
        }
        
    });

    const runConsoleProofCommand = vscode.commands.registerCommand('tamarin.runConsoleProofCommand', () => {
        if (vscode.window.activeTextEditor){
            const source = "'" + vscode.window.activeTextEditor.document.uri.fsPath + "'";
            vscode.window.activeTextEditor.document.save().then( () => {
                const timer = "time"
                const program = "tamarin-prover";
                const args: Array<string> = ["--prove"];
                const conf = vscode.workspace.getConfiguration('tamarin.parameter');
                if(!conf.get('quitOnWarning')){
                    args.push("--quit-on-warning");
                }
                if(!conf.get('autoSources')){
                    args.push("--auto-sources");
                }
                args.push(source);
                const terminal = getTerminal();
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