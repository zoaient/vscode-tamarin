import fs = require('fs');
import path = require('path');
import Parser =require( "tree-sitter");
import Tamarin = require("./tree-sitter-tamarin")




//Tests avec le parser

const parser = new Parser();
parser.setLanguage(Tamarin);

const sourceCodePath = './tree-sitter-tamarin/example_file.spthy';
const sourceCode = fs.readFileSync(path.resolve(__dirname, sourceCodePath), 'utf8');

const tree = parser.parse(sourceCode);

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