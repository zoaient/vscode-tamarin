// .eslintrc.js
module.exports = {
  // Indique à ESLint que c'est le fichier de configuration racine. Il arrêtera de chercher dans les dossiers parents.
  root: true, 
  
  // Spécifie le "traducteur" (parser) à utiliser.
  parser: '@typescript-eslint/parser', 

  // Définit les plugins que nous allons utiliser.
  plugins: [
    '@typescript-eslint',
  ],

  // Permet d'hériter de configurations de base. C'est la partie la plus importante.
  extends: [
    // Règles de base recommandées par ESLint.
    'eslint:recommended', 
    
    // Règles spécifiques à TypeScript recommandées par le plugin.
    // Désactive les règles de base d'ESLint qui sont en conflit avec TypeScript.
    'plugin:@typescript-eslint/recommended', 
  ],

  // Définit les environnements globaux que ton code utilise.
  env: {
    // Reconnaît les variables globales de Node.js (comme `module`, `require`, `__dirname`).
    node: true, 
    
    // Reconnaît les fonctionnalités modernes de JavaScript.
    es2021: true,
  },

  // Ici, tu peux personnaliser ou désactiver des règles spécifiques.
  rules: {
    // Par exemple, si tu as besoin d'utiliser `require` dans tes scripts de build.
    '@typescript-eslint/no-var-requires': 'off',

    // Une autre règle souvent ajustée : permettre les fonctions vides.
    '@typescript-eslint/no-empty-function': 'off',
    
    // Tu peux aussi rendre certaines règles moins strictes.
    // Par exemple, si tu veux être averti pour les variables non utilisées au lieu d'avoir une erreur bloquante.
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
  },
};