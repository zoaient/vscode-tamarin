# Change Log

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