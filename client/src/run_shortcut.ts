
import * as vscode from 'vscode';
import path = require('path');


export function runShortcut(context : vscode.ExtensionContext){
  let playButton : vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  playButton.text = "$(triangle-right) Run";
  playButton.command = "tamarin.showActions";
  playButton.show();
  const showActions = vscode.commands.registerCommand('tamarin.showActions', async () => {
      const actions: vscode.QuickPickItem[] = [
        { label: 'Run Tamarin Prover', description: 'Run Tamarin prover ' },
        { label: 'Run Tamarin Prover  auto-sources', description: 'Run Tamarin prover with --auto-sources option'  },
      ];

      const selectedAction = await vscode.window.showQuickPick(actions, {
        placeHolder: 'Select an action',
      });

      if (selectedAction && selectedAction.label === 'Run Tamarin Prover') {
        vscode.commands.executeCommand('tamarin.play')
      }
      else if (selectedAction && selectedAction.label === 'Run Tamarin Prover  auto-sources'){
          vscode.commands.executeCommand('tamarin.play2')
      }
    });

  const runTamarin = vscode.commands.registerCommand('tamarin.play', async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if(activeEditor){
          await activeEditor.document.save();
          const document = activeEditor.document;
          const filePath = document.uri.fsPath;
          const fileDirectory = path.dirname(filePath);
          const terminal = vscode.window.createTerminal({
              name: `Play: Tamarin`,
              cwd: fileDirectory
          });
          terminal.sendText(`tamarin-prover interactive "${filePath}"`);
          terminal.show();
      }
  });

      const runTamarinAutoSources = vscode.commands.registerCommand('tamarin.play2', async () => {
          const activeEditor = vscode.window.activeTextEditor;
          if(activeEditor){
            await activeEditor.document.save();
            const document = activeEditor.document;
            const filePath = document.uri.fsPath;
            const fileDirectory = path.dirname(filePath)
            const terminal = vscode.window.createTerminal({
                name: `Play: Tamarin`,
                cwd: fileDirectory
            });
            terminal.sendText(`tamarin-prover interactive "${filePath}" --auto-sources`);
            terminal.show();
          }

  });
  context.subscriptions.push(showActions);
  context.subscriptions.push(runTamarin);
  context.subscriptions.push(runTamarinAutoSources);
  }