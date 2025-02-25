# Choix de SGBDR

**Maria Db**,

C'est open source, c'est typé sur MySQL, on peut gérer un système de cache et il est très connu donc plus facile pour trouver des informations. 
Comme c'est n'est pas du NoSQL:
Il faudra pas négliger la scalabilité donc il faudra de temps a autre partitionner les données.

# ORM

## Qu'est ce ?
    Un Object-Relational Mapping est un framework permettent de créer une correspondance entre un modèle objet et un modèle relationnel de base de données.Un ORM fournit généralement les fonctionnalités suivantes :
    - génération à la volée des requêtes SQL les plus simples (CRUD)
    - prise en charge des dépendances entre objets pour la mise en jour en cascade de la base de données
    - support pour la construction de requêtes complexes par programmation

##  Choix

On a plusieurs choix mais je vais présenter que les plus connus:

- Hibernate: Un titan, il dispose de tout un tas de fonctionnalité mais il est cmplexe a prendre en mains et pt un peu obvious pour un projet aussi petit 

- JPA: C'est l'API standard utilisé par d'autres framework like EclipsLink et DataNucleus. Il offre une portabilité grande donc on peut changer et évoluer facilement, mais il offre des fonctions moins riches que d'autres framwork. Ce N'EST PAS un framework

- EclipsLink: Il est bien opti et supporte des énorme base de données. Il s'intégre très bien avec d'autres JEE (Java Enteprise Edition, d'après ce que j'ai compris c'est tous plein de framework qui sont utlisée pour dév des applis en entreprise). Mais il est très complexe a setup et utilisé 

- DataNucleus: Il supporte plein de type de base de donnés (dans notre cas on s'en fout pcq MariaDb est supporté par tt le monde). Il est simple mais il implémente pas toutes les fonctionnalité des autres ORM .

## Avis

Perso je pense que DataNucleus ferra l'affaire pour le logiciel et si on ce rend compte en plein milieu qu'il n'est pas suffisant on pourra facilement le changer pcq il est basé sur le JPA (l'API de JPA).

# JDBC

Faudra setup pour établir une connection entre notre base de donnée et le code.

# Outil de monitoring

Jmx ou VisualVM pour voir les perfs de l'appli
