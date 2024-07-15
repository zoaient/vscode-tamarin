import * as vscode from 'vscode';
import * as child_process from 'child_process';
import path = require('path');
import { runShortcut } from './features/run_shortcut';
import { display_syntax_errors } from './features/syntax_errors';
import { RenameCommand } from './features/rename';
import { go_to_definition_command } from './features/go_to';



function plugin_features(context : vscode.ExtensionContext){
   runShortcut(context);
   display_syntax_errors(context)
   RenameCommand(context)
   go_to_definition_command(context)
  
}



export function activate(context: vscode.ExtensionContext) {

    console.log('Tamarin extension is now active');

    //Fonctionnalités du plugin
     plugin_features(context);
     
     
    
}