# Using tree-sitter for Tamarin plugin.

### Import grammar 
All the files required to use the grammar with the plugin are located in src/grammar/tree-sitter-tamarin.

To use tree-sitter with a customized grammar (or one modified from the current version), use ```the tree-sitter generate command```.
\
 ⚠️ this command creates many of the files needed to use the grammar with Typescript, for example grammar.js, as well as json and C files. Among these files, the parser is created.

### Import parser
Then, to use the parser inside the vscode plugin, use the : 
\
```tree-sitter build --wasm --output location_of_the_output```
\
To perform this command you need to have docker running or install other applications suggested on tree sitter website:
\
 https://tree-sitter.github.io/tree-sitter/creating-parsers#command-build
\
This command creates a dynamic .wasm library which enables you to use the parser into the plugin.


### Using the parser  
Finally, to create an instance of the parser using our new grammar, I found many different versions available on the internet. The only one that worked for me was : 
\
```Typescript 
import Parser =require( "web-tree-sitter");
```
\
And then inside a function :

```Typescript
await Parser.init();
const parser = new Parser();
const Tamarin =   await Parser.Language.load('/absolute_path_to_wasm_file');
parser.setLanguage(Tamarin);
```


