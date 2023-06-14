# API Call management

*Attention:* 
* La réponse à ce problème doit être accompagnée de tests unitaires qui seront éxécutés afin d'évaluer si votre solution fonctionne correctement.
* L'implémentation sera mieux comprise en javascript (ou mieux typescript), mais un autre langage peut être utilisé tant que le code est bien explicite.
* Le module (ou classe) que vous aurez mis en place peut se baser sur un module d'appel http sous-jacent de votre choix (et en fonction de si vous choisissez de faire ce module pour une application front, ou backend).
  
Exemple d'utilisation du module que vous aurez créé avec l'API sous-jacente FETCH:
```
const result = await myModule.fetch<ReturnedType>("myapi/path", {method: "POST", body: JSON.stringify({payload})});
```
Cet exemple n'est là que pour aider à la compréhension du problème, mais libre à vous de proposer une api qui vous semble plus pertinente.

-------------
# Problème

Supposons que vous ayez une application front ou backend. 

Cette application échange avec une API qui a :
1. Une route `baseUrl/login` pour se logguer avec un client_id + client_secret. Celle-ci te renvoie deux tokens : 
    * un *main token* qui expire assez rapidement (1 jour par exemple)
    * un *refresh token* qui expire au bout de 1 semaine.

2. Une route `baseUrl/refresh` qui te permet d'envoyer le refresh token afin que l'API le valide et renvoie un main token et un refresh token 
tout frais (à nouveau valide 1 jour et une semaine).
   
3. Toutes les autres routes qui nécessitent de rajouter un header `authorization` avec pour valeur le main token. 
   Si ce token n'est pas valide ou expiré, le serveur répond par une 401.

Nous souhaitons avoir cette logique d'authentification :

1. Lorsqu'aucun token d'authentification n'est disponible, on affiche l'écran de login de l'app 
   pour que l'utilisateur entre son username + mot de passe.

2. Une fois qu'on est connecté, on peut appeler les autres requêtes normalement.
    1. Si une requête X répond par un statusCode autre que 401, on traite la requête normalement. 
    2. Si une requête X répond par une 401, alors l'application appelle la route `baseUrl/refresh` avec le refresh token. Ensuite deux cas se présentent :
       1. La route `baseUrl/refresh` renvoie un couple *main/refresh token*, alors l'app refait une requête X avec le nouveau main token. 
          Si le serveur répond à nouveau avec une 401, on déconnecte l'utilisateur pour qu'il revienne sur l'écran de login. 
          Sinon, l'utilisateur continue d'utiliser l'app normalement.
       2. La route baseUrl/refresh répond avec un code erreur (401 probablement, mais pourquoi pas 500), alors l'app revient sur l'écran de login.


Si vous souhaitez réaliser ce module dans le cadre d'une application front, celle-ci communique avec un serveur présentant l'API décrite ci-dessus (on a une communication browser -> serveur). On peut imaginer qu'un utilisateur peut rentrer ses identifiants dans une interface pour obtenir un token d'autorisation. Mais dans cet exercice nous ne nous intéressons pas à l'interface graphique, seulement a la classe ou module qui permet d'exécuter la logique d'authentification pour qu'elle soit transparente pour les développeurs travaillant sur cette application front.

Si vous souhaitez réaliser ce module dans le cadre d'une application backend, cette dernière communique avec un serveur présentant aussi l'API décrite ci-dessus (on a une communication serveur -> serveur). Dans ce cas, on peut supposer que les identifiants sont stockés dans un fichier de configuration et passés au module à travers une méthode ou autre. Les développeurs travaillant sur ce backend, n'ont pas besoin de se soucier de la logique d'authentification pour communiquer avec cet autre serveur, ils utilisent simplement votre module pour le faire.

Dans tous les cas, le module ne s'intéresse pas à où sont stockés les identifiants. Ils doivent être fournis en entrée du module.

Quelle structure mettriez-vous en place pour gérer ce flow à chaque fois qu'une requête est faite. L’idée bien sûr étant d'éviter un maximum la redondance du code pour qu'à chaque fois qu'une route de l'API est appelée, ce mécanisme se mette en place.

**Pour rappel, il est aussi nécessaire que la solution que vous apportiez soit accompagnée de tests unitaires**

   
