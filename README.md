# velib-cartography

## Présentation 

Ce projet a été réalisé dans le cadre de mes études en Master 2 Informatique THYP (Technologies de l'Hypermédia) à l'Université Paris 8. Les objectifs du projet incluaient l'utilisation et l'analyse de données en temps réel, la création d'un système de visualisation, le traitement des données pour résoudre une problématique spécifique, l'intégration d'une base de données, et éventuellement l'application d'un système d'apprentissage artificiel.

Pour répondre à ces exigences, j'ai choisi d'exploiter l'API "velib-disponibilite-en-temps-reel" fournie par Open Data Paris.

Mon projet se nomme “Velib cartography” et a pour vocation de faciliter la vie des utilisateurs du service en proposant la visualisation de l’ensemble du réseau vélib’ via une carte interactive et la possibilité de calcul d’itinéraire incluant le dépôt d’un vélo dans une station avec une borne libre. 

## Démonstration vidéo

[Démo : cartographie des stations Vélib'](https://www.youtube.com/watch?v=PQ2FSZaYuVc)


## Installation

1. Créez  un fichier `config.js` à la racine avec le contenu suivant `export const GRAPH_HOPPER_API_KEY = VOTRE_CLE_API;`
2. Importer la base de données avec le fichier `src/sql/m2_velib_cartography.sql`
3. Accédez à l'application en naviguant vers le dossier src.


