import { TextDocument } from 'vscode-languageserver-textdocument';
import {TamarinSymbol } from '../../symbol_table/tamarinTypes'; 
import { DeclarationType } from '../../symbol_table/tamarinTypes'; 
import {check_action_fact} from '../checks/checkActionFacts'
import {createMockSymbol, createMockSymbolTable , } from './utils';


const mockDocument = TextDocument.create('file:///test.spthy', 'tamarin', 1, '');

describe('checkActionFacts', () => {
    it('Should return an error if an action fact is used without ever being declared', () => {
        const symbols: TamarinSymbol[] = [
            createMockSymbol({
                name: 'MyActionFact',
                declaration: DeclarationType.ActionF,
                contextOptions: {grammarType: 'other_context'}
            })
        ];
        const symbolTable = createMockSymbolTable(symbols);
        const diagnostics = check_action_fact(symbolTable, mockDocument);
        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0].message).toContain("Error: this action fact is never declared");
    });

    it('Should not return an error if an action fact is used after being declared', () => {
        const symbols: TamarinSymbol[] = [
            createMockSymbol({
                name: 'MyActionFact',
                declaration: DeclarationType.ActionF,
                contextOptions: {grammarType: 'simple_rule'}
            }),
            createMockSymbol({
                name: 'MyActionFact',
                declaration: DeclarationType.ActionF,
                contextOptions: {grammarType: 'other_context'}
            })
        ];
        const symbolTable = createMockSymbolTable(symbols);
        const diagnostics = check_action_fact(symbolTable, mockDocument);
        expect(diagnostics).toHaveLength(0);
    });

    it('Should return an error if an action fact is used with inconsistent arity', () => {
        const symbols: TamarinSymbol[] = [
            createMockSymbol({
                name: 'MyActionFact',
                declaration: DeclarationType.ActionF,
                contextOptions: {grammarType: 'simple_rule'},
                arity: 1
            }),
            createMockSymbol({
                name: 'MyActionFact',
                declaration: DeclarationType.ActionF,
                contextOptions: {grammarType: 'other_context'},
                arity: 2
            })
        ];
        const symbolTable = createMockSymbolTable(symbols);
        const diagnostics = check_action_fact(symbolTable, mockDocument);
        expect(diagnostics).toHaveLength(2);
        expect(diagnostics[0].message).toContain("Error : incoherent arity");
    });

    it('Should not return an error if an action fact is used with consistent arity', () => {
        const symbols: TamarinSymbol[] = [
            createMockSymbol({
                name: 'MyActionFact',
                declaration: DeclarationType.ActionF,
                contextOptions: {grammarType: 'simple_rule'},
                arity: 2
            }),
            createMockSymbol({
                name: 'MyActionFact',
                declaration: DeclarationType.ActionF,
                contextOptions: {grammarType: 'other_context'},
                arity: 2
            })
        ];
        const symbolTable = createMockSymbolTable(symbols);
        const diagnostics = check_action_fact(symbolTable, mockDocument);
        expect(diagnostics).toHaveLength(0);
    });
});
