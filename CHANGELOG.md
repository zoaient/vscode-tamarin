
# Change Log
## V2.1.0
Recursive Analysis has been implemented.
- Symbols imported from other Tamarin files are no longer reported as errors.
- Syntax highlighting has been updated
- Few wellformedness Checks has been updated as well of a few tests
- 2 new unitary tests to test wellformedness checks with symbols imported from another file.
- .splib parsing has been added , now imported files must be .splib
## V2.0.0
### Language Server Protocol
Lsp has been fully implemented : This includes
- Redesign of plugin's structure
- Communication between client and server with JSON-RPC
- Proper implementation of go_to and rename functions
Performance issues due to the fact that the plugin opened all files even non tamarin ones is now fixed for good
### Refactoring , tests and optimisations
- Wellformedness checks has been divided into 10 new files (see server/src/features/checks)
- Symbol Table build has also been refactored (server/src/symbol_table)
- Linter has been added 
- 62 new unitary tests are added (see full list on Documentation/Tests.md)
- Parser is now initialised only when opening a new file , instead of every change
### Fixes
- New Wellformedness checks to check equalities
- naturals_numbers builtin added

## V1.1.6
Removed all uncessary packages 

## V1.1.5
### Fixes
-Functions in lemmas are now correctly detected
-Ctrl+tab hotkey has been changed to Ctrl+alt+n
-Non tamarin files are not opened by the plugin anymore

### Features
-Enhanced documention
-New grammar added (Error display and highlithing updated accordingly)
-.splib added as an official extension

## V1.1.4
-Small fixes about "fst", "snd", and "pair" functions.
-New logo.
-Comments in the code.

## V1.1.0
New welformedness checks and fixes.

### New checks 
 - Checks wether all variables in the right part of a macro are in the left part or public.
- Checks wether all variable in the right part of an equation are in the left part.
- Provides a quick fix for function names again with editing distance.
- Checks wether built-ins are imported to use corresponding functions or symbols (provides a quick fix to import the right built-in).

### Fixes 
- Editing distance is now used to display all close tokens (distance < 3) and not the first one only.
- `diff` is considered as a reserved function symbol so that there is no error while using it. 
- Functions with arity 0 may be used without parenthesis.

## V1.0.1
Fix package.json

## V1.0.0
Initial release after fork from giclu-3.

### Features:

- Enhances giclu-3's syntax highlighting.
- Adds comprehensive syntax error detection based on the grammar with ```MISSING``` or ```ERROR``` messages.
- Provides various wellformedness checks:
    - Checks position and usage of reserved facts (```Fr```, ```Out```, ```In```, ```K```, ```KD```, ```KU```).
    - Checks whether variable are used consistly inside a rule, i.e., using the same capitalization and sort.
    - Spellcheck on facts (must start with an uppercase letter).
    - Checks whether all variables in the conclusion of a rule appear in the premises (except public variables).
    - Checks the arity of facts and functions.
    - Checks whether a lemma uses free terms.
    - Checks whether all facts in the premises of the rules appear in the conclusion of some (other) rule (provides a quick fix by using the closest exisiting fact, based on editing distance).

- Use right click and ```Rename``` on an indentifier to rename all occurences of it inside a rule or a lemma.
- Use right click and ```Search Definition``` on facts or function names and press ```CTRL```+```TAB``` to navigate through all occurences.