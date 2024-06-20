"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var Parser = require("tree-sitter");
var Tamarin = require("./tree-sitter-tamarin");
//Tests avec le parser
var parser = new Parser();
parser.setLanguage(Tamarin);
var sourceCodePath = './tree-sitter-tamarin/example_file.spthy';
var sourceCode = fs.readFileSync(path.resolve(__dirname, sourceCodePath), 'utf8');
var tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
/*function display_tree(node : Parser.SyntaxNode | null){
    if (node !== null){
    console.log(node.toString());
    for (let i = 0 ; i< node.childCount; i++){
        if(node.child(i) !== null){
            display_tree(node.child(i));
        }
    }
}
}

display_tree(tree.rootNode)*/ 
