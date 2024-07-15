# Tamarin vscode extension

Visual Studio Code extension for Tamarin files (.spthy) based on giclu-3 extension and using "Integrate Tree-sitter grammar for Spthy". 

![ Alt Text](./images/error.png)

Features : 

- Enhances giclu-3 syntax highlighting.
- Adds syntax errors detection with ```MISSING```or ```ERROR``` messages.

- #### Provides various welformedness checks : 
    - Position of reserved facts(Fr ,Out ,In, K, KD, KU).
    - Variables consistency inside a rule.
    - Spellcheck on facts ( provides a quick fix).
    - Variables in conclusion of a rule are in premice.
    - Arity check on facts and functions. 
    - Free term in lema check.
    - Facts in premice must appear in conclusion.
    
    For more details on welformedness check, see the tamarin prover manual section : https://tamarin-prover.com/manual/master/book/010_modeling-issues.html
    
- Use right click and ```Rename```on an indentifier to rename all occurences of it inside a rule or a lemma.
- Use right click and ```Search Definition ```on facts or function names and press ```CTRL```+```TAB``` to navigate through occurences.   