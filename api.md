# Documentation de l'API - Marina API

## Présentation
Cette API permet de gérer un port de plaisance.

Elle permet de gérer :
- les utilisateurs
- les catways
- les réservations

L'application contient également :
- une page d'accueil
- un formulaire de connexion
- un tableau de bord

---

## URL de base

En local :

    http://localhost:3000

---

# Routes de l'API

## Accueil

### GET /
Affiche la page d'accueil de l'application.

Réponse attendue :
- une page HTML
- une présentation
- un formulaire de connexion
- un lien vers la documentation API

---

## Tableau de bord

### GET /dashboard
Affiche le tableau de bord de l'application.

Réponse attendue :
- une page HTML
- des liens vers les utilisateurs, les catways, les réservations et la déconnexion

---

## Authentification

### POST /login
Permet de vérifier les identifiants d'un utilisateur.

Champs attendus :
- email
- password

Réponses possibles :
- Connexion réussie
- Utilisateur introuvable
- Mot de passe incorrect

### GET /logout
Permet de déconnecter l'utilisateur.

Réponse attendue :
- Déconnexion réussie

---

# Utilisateurs

### GET /users
Récupère la liste de tous les utilisateurs.

Exemple de réponse :

    [
      {
        "_id": "id",
        "username": "Lily",
        "email": "lily@test.com",
        "password": "123456"
      }
    ]

### GET /users/:email
Récupère un utilisateur à partir de son email.

Exemple :
    
    /users/lily@test.com

### POST /users
Crée un nouvel utilisateur.

Champs attendus :
- username
- email
- password

### PUT /users/:email
Met à jour un utilisateur à partir de son email.

Champs modifiables :
- username
- password

### DELETE /users/:email
Supprime un utilisateur à partir de son email.

---

# Catways

### GET /catways
Récupère la liste de tous les catways.

Exemple de réponse :

    [
      {
        "_id": "id",
        "catwayNumber": 1,
        "catwayType": "short",
        "catwayState": "bon état"
      }
    ]

### GET /catways/:id
Récupère un catway à partir de son numéro.

Exemple :

    /catways/1

### POST /catways
Crée un nouveau catway.

Champs attendus :
- catwayNumber
- catwayType
- catwayState

### PUT /catways/:id
Met à jour un catway à partir de son numéro.

Champs modifiables :
- catwayType
- catwayState

### DELETE /catways/:id
Supprime un catway à partir de son numéro.

---

# Réservations

### GET /reservations
Récupère la liste de toutes les réservations.

### GET /catways/:id/reservations
Récupère les réservations d'un catway donné.

Exemple :

    /catways/1/reservations

### GET /catways/:id/reservations/:idReservation
Récupère une réservation précise d'un catway.

Exemple :

    /catways/1/reservations/ID_RESERVATION

### POST /catways/:id/reservations
Crée une réservation pour un catway donné.

Champs attendus :
- clientName
- boatName
- startDate
- endDate

### PUT /catways/:id/reservations/:idReservation
Met à jour une réservation existante.

Champs modifiables :
- clientName
- boatName
- startDate
- endDate

### DELETE /catways/:id/reservations/:idReservation
Supprime une réservation existante.

---

# Technologies utilisées
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- EJS

---

# Remarques
- Les données des catways et des réservations ont été importées depuis les fichiers JSON fournis.
- Certaines routes de test ont été utilisées pendant le développement, mais ne font pas partie des routes principales documentées ici.