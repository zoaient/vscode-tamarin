import fs = require('fs');
import path = require('path');
import Parser = require('tree-sitter');
import Tamarin = require('./tree-sitter-tamarin');

const parser = new Parser();
parser.setLanguage(Tamarin);

const sourceCodePath = './tree-sitter-tamarin/example_file.spthy';
const sourceCode = fs.readFileSync(path.resolve(__dirname, sourceCodePath), 'utf8');

const tree = parser.parse(sourceCode);

console.log(tree.rootNode.toString());

const callExpression = tree.rootNode.child(1);
console.log(callExpression);