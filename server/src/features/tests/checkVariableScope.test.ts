// Dans src/features/checks/checkVariableScope.test.ts

import { TextDocument } from 'vscode-languageserver-textdocument';
import {TamarinSymbol } from '../../symbol_table/tamarinTypes'; // Adaptez le chemin
import { TamarinSymbolTable } from '../../symbol_table/create_symbol_table';
import { DeclarationType } from '../../symbol_table/tamarinTypes'; // Adaptez le chemin
import { check_variable_is_defined_in_premise } from '../checks/checkVariableScope'; // La fonction à tester
import { Range } from 'vscode-languageserver-types';

// Helper pour créer un faux SyntaxNode. On ne simule que ce qui est utilisé.
const createMockNode = (id: number, parentType: string) => ({
    id,
    startIndex: 0,
    endIndex: 1,
    parent: { grammarType: parentType },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}as any);

// Helper pour créer un faux TamarinSymbol
const createMockSymbol = (
    name: string,
    declaration: DeclarationType,
    contextNodeId: number,
    parentNodeType: string,
    type?: string
): TamarinSymbol => ({
    name,
    declaration,
    type,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: { id: contextNodeId } as any, // On simule juste le context par son ID
    node: createMockNode(Math.random() * 1000, parentNodeType),
    name_range: Range.create(0, 0, 0, name.length) // <-- Add this line
});

// Mock du document
const mockDocument = TextDocument.create('file:///test.spthy', 'tamarin', 1, '');

describe('check_variable_is_defined_in_premise', () => {

    it('devrait ne retourner aucune erreur pour une règle valide', () => {
        // SCÉNARIO : Règle `[ In(x) ] --> [ Out(x) ]`
        const symbols: TamarinSymbol[] = [
            createMockSymbol('x', DeclarationType.PRVariable, 1, 'premise'), // `x` dans la prémisse
            createMockSymbol('x', DeclarationType.CCLVariable, 1, 'conclusion') // `x` dans la conclusion
        ];
        const symbolTable = { getSymbols: () => symbols } as TamarinSymbolTable;

        const diagnostics = check_variable_is_defined_in_premise(symbolTable, mockDocument);

        expect(diagnostics).toHaveLength(0); // On s'attend à 0 erreur
    });

    it("devrait retourner une erreur si une variable de conclusion n'est pas dans la prémisse", () => {
        // SCÉNARIO : Règle `[ ] --> [ Out(y) ]`
        const symbols: TamarinSymbol[] = [
            createMockSymbol('y', DeclarationType.CCLVariable, 1, 'conclusion') // `y` seulement en conclusion
        ];
        const symbolTable = { getSymbols: () => symbols } as TamarinSymbolTable;

        const diagnostics = check_variable_is_defined_in_premise(symbolTable, mockDocument);

        expect(diagnostics).toHaveLength(1); // On s'attend à 1 erreur
        expect(diagnostics[0].message).toContain("doesn't appear in premise");
    });

    it("devrait ignorer les variables publiques ($)", () => {
        // SCÉNARIO : Règle `[ ] --> [ Out($y) ]`
        const symbols: TamarinSymbol[] = [
            createMockSymbol('$y', DeclarationType.CCLVariable, 1, 'conclusion', '$') // `y` est publique
        ];
        const symbolTable = { getSymbols: () => symbols } as TamarinSymbolTable;

        const diagnostics = check_variable_is_defined_in_premise(symbolTable, mockDocument);

        expect(diagnostics).toHaveLength(0); // Les variables publiques sont exemptées
    });
    
    it("devrait retourner une erreur si un fait en prémisse n'est jamais utilisé en conclusion", () => {
        // SCÉNARIO : Un fait `Fact(z)` est en prémisse, mais aucun `Fact` n'est en conclusion
        const symbols: TamarinSymbol[] = [
            createMockSymbol('UnusedFact', DeclarationType.LinearF, 1, 'premise'), // Fait non utilisé
            createMockSymbol('OtherFact', DeclarationType.LinearF, 2, 'conclusion')
        ];
        const symbolTable = { getSymbols: () => symbols } as TamarinSymbolTable;

        const diagnostics = check_variable_is_defined_in_premise(symbolTable, mockDocument);

        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0].message).toContain("fact occur in premise but never in any conclusion");
    });

});