## Done

- utilisation de vite + typescript
- installation de prettier + config eslint pour désactiver formatage
- installation de vitest
- installation de msw

## Notes

- j'ai supposé que l'api de login était un post car ce n'était pas précisé
- pour le retour de l'appel j'ai défini moi même le nom des propriétés pour main token et refresh token
- je n'ai pas implémenté le login dans l'app, je n'avais pas l'impression que c'était demandé. Le principe ici c'est 
  que l'appli catche l'erreur spécifique `AuthenticationError` et redirige l'utilisateur vers la page de login
- plutôt que d'avoir des mocks spécifiques dans chaque test avec msw, j'ai préféré coder des tokens particuliers dans
  le fichier `handlers.ts` pour simuler les edge cases, c'est un choix qui se discute
- au niveau des tests unitaires je n'ai pas fait d'assertion pour vérifier quelle api était appelée combien de fois
  pour vérifier que c'est bien le bon flow qui s'exécute pour éviter d'avoir des tests trop lourds à lire. Là aussi
  c'est un choix qui se discute

## Utilisation

- faire un `npm install` pour installer les dépendances
- faire un `npm run test:run` pour lancer la suite de test unitaire
