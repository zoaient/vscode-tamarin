#include <tree_sitter/parser.h>
#include <cwctype>

enum TokenType {
    MULTI_COMMENT,
    SINGLE_COMMENT
};

extern "C" {

void *tree_sitter_splib_external_scanner_create() {
    return NULL;
}

void tree_sitter_splib_external_scanner_destroy(void *payload) {
}

unsigned tree_sitter_splib_external_scanner_serialize(void *payload, char *buffer) {
    return 0;
}

void tree_sitter_splib_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
}

bool tree_sitter_splib_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    while (iswspace(lexer->lookahead)) {
        lexer->advance(lexer, true);
    }
    if (valid_symbols[MULTI_COMMENT] && lexer->lookahead == '/') {
        lexer->advance(lexer, false);
        if (lexer->lookahead != '*') return false;
        lexer->advance(lexer, false);

        int depth = 1;
        while (depth > 0) {
            if (lexer->lookahead == 0) return false;
            if (lexer->lookahead == '*') {
                lexer->advance(lexer, false);
                if (lexer->lookahead == '/') {
                    lexer->advance(lexer, false);
                    depth--;
                }
            } else if (lexer->lookahead == '/') {
                lexer->advance(lexer, false);
                if (lexer->lookahead == '*') {
                    lexer->advance(lexer, false);
                    depth++;
                }
            } else {
                lexer->advance(lexer, false);
            }
        }
        lexer->result_symbol = MULTI_COMMENT;
        return true;
    }

    if (valid_symbols[SINGLE_COMMENT] && lexer->lookahead == '/') {
        lexer->advance(lexer, false);
        if (lexer->lookahead != '/') return false;
        lexer->advance(lexer, false);
        while (lexer->lookahead != 0 && lexer->lookahead != '\n') {
            lexer->advance(lexer, false);
        }
        lexer->result_symbol = SINGLE_COMMENT;
        return true;
    }

    return false;
}
} 

    