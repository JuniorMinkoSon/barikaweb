# Checklist démo hackathon — Plateforme Tourisme

## 1) Préparation (2 min)

- Démarrage recommandé (PowerShell, profil local H2): `$env:SPRING_PROFILES_ACTIVE='local'; .\\mvnw.cmd spring-boot:run`.
- Lancer l'application.
- Vérifier l'accès à l'accueil: `http://localhost:8082/`.
- Vérifier la page catégories: `/tourisme-categories`.
- Vérifier la recherche séjours: `/sejours`.
- Vérifier le module workflows: `/acteur/workflows` (après connexion).

## 2) Comptes de démonstration

Mot de passe commun des acteurs: `demo123`

- Touriste: `touriste@tourismhub.ci`
- Guide: `guide@tourismhub.ci`
- Artisan: `artisan@tourismhub.ci`
- Organisateur: `organisateur@tourismhub.ci`
- Ministère: `ministere@tourismhub.ci`
- Admin (si besoin): `admin@unevie.ci` / `admin123`

### Données workflows déjà seedées

- Validation guide en attente: `REF-GUIDE-2026-001` (compte guide).
- Certificat en attente: `ARTISAN_AUTHENTICITY` / `ART-2026-ABJ-01`.
- Certificat déjà émis (démo hash): `GUIDE_LICENSE` / `GUIDE-2026-CI-VALID`.
- Billetterie prête: `Festival Culture & Lagune 2026` (500 places, 35 vendues).
- Fréquentation prête: `Grand-Bassam`, 1240 visiteurs.

## 3) Parcours démo recommandé (8–10 min)

### A. Découverte publique

- Ouvrir l'accueil et présenter le positionnement tourisme ivoirien.
- Afficher les catégories (plage, culture, nature, affaires).
- Faire une recherche de séjour avec destination + dates + budget.

### B. Parcours Touriste

- Se connecter avec `touriste@tourismhub.ci`.
- Vérifier la redirection vers `/acteur/touriste`.
- Ouvrir une offre et simuler une réservation.
- Ouvrir `/acteur/workflows` et montrer la traçabilité des certificats/flux.

### C. Parcours Prestataire tourisme

- Se connecter en `guide@tourismhub.ci` puis `artisan@tourismhub.ci`.
- Montrer le dashboard acteur dédié.
- Expliquer la contribution locale (expériences/produits culturels).
- Montrer la demande de validation guide et la demande de certificat.

### D. Parcours Gouvernance

- Se connecter en `ministere@tourismhub.ci`.
- Montrer l'espace ministère (pilotage/vision écosystème).
- Traiter une validation guide + émettre un certificat + enregistrer une fréquentation.

## 4) Points techniques à citer au jury

- Authentification multi-acteurs avec rôles dédiés.
- Accès public aux pages vitrine tourisme.
- Recherche de séjours orientée disponibilité/période/budget.
- Flux fournisseur recentré sur services et réservations (sans commande/livraison).
- Workflows MVP actifs: validation guide, certificats traçables, billetterie, fréquentation.
- Initialisation de données de démo et comptes prêts à l'emploi.

## 5) Plan B si incident en live

- Recharger l'application et relancer une connexion acteur.
- Basculer sur la démonstration publique (`/`, `/tourisme-categories`, `/sejours`).
- Conclure sur l'architecture rôles + extensibilité.
