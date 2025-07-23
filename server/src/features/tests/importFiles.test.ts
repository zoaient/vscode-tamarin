import { TextDocument } from 'vscode-languageserver-textdocument';
import { AnalysisManager } from '../../AnalysisManager';
import path from 'path';
import * as fs from 'fs';

describe('AnalysisManager: Analyse des Imports', () => {
    let analysisManager: AnalysisManager;
    const virtualFileSystem = new Map<string, string>();
    const mainPath = '/project/main.spthy';
    const libAPath = '/project/libA.spthy';
    const libBPath = '/project/libB.spthy';
    const utilPath = '/project/utils/util.spthy';
    beforeAll(async () => {
        analysisManager = new AnalysisManager();
        const parserPath = path.resolve(process.cwd(), 'server/grammar/tree-sitter-tamarin/tree-sitter-spthy.wasm');
        await analysisManager.initParser(parserPath);
    });
    beforeEach(() => {
        virtualFileSystem.clear();
        analysisManager.clearCache();
        jest.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
            if (virtualFileSystem.has(filePath)) {
                return virtualFileSystem.get(filePath)!;
            }
            throw new Error(`ENOENT: File not found in virtual file system: ${filePath}`);
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('devrait analyser un fichier et son import direct', async () => {

    });
});