# Using tree-sitter in the Tamarin plugin

First you will need to go to src/grammar/tree-sitter-tamarin folder.
```cd src/grammar/tree-sitter-tamarin```

## Installing dependencies
### On macOS
```brew install tree-sitter docker podman```  TODO : update ?
### On linux
```sudo apt install podman``` 
```npm install``` 

## Podman machine initialisation
These commands are necessary to build the parser.
`podman machine init`
`podman machine start`

## Updating the grammar
This plugin uses tamarin's grammar https://github.com/tamarin-prover/tamarin-prover/blob/develop/tree-sitter/tree-sitter-spthy/grammar.js
In order to update the grammar , you must change the grammar.js file in src/grammar/tree-sitter-tamarin folder.
Then , do the following commands.
```tree-sitter generate``` This command creates all the files needed to use the grammar with Typescript
```tree-sitter build-wasm``` This command creates a dynamic .wasm library which enables you to use the parser inside the vscode plugin.

## Using the parser
There are many ways to create an instance of the parser using a new grammar. Here we use the following approach.
```Typescript
import Parser =require( "web-tree-sitter");
```
And then inside a function :
```Typescript
await Parser.init();
const parser = new Parser();
const Tamarin =   await Parser.Language.load('/absolute_path_to_wasm_file');
parser.setLanguage(Tamarin);
```
## Parser usages
The parser is used in :

src/symbol_table/create_symbol_table.ts
src/features/syntax_errors.ts

