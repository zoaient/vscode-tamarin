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
function display_tree(node) {
    var _a;
    if (node !== null) {
        console.log((_a = node.parent) === null || _a === void 0 ? void 0 : _a.children);
        for (var i = 0; i < node.childCount; i++) {
            if (node.child(i) !== null) {
                display_tree(node.child(i));
            }
        }
    }
}
display_tree(tree.rootNode);
