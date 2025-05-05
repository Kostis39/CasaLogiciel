# Casa Central

# Backend

## Quickstart

1. Dans un *venv* python en 3.11 exécuter `pip install - r pyreqs.txt`   
2. Se connecter au VPN via `vpnlog.sh` en ayant préalablement créé un fichier `vpn-auth.txt` de la manière suivante :
   ```
   identifiant
   motdepasse
   ```
3. Lancer le serveur test avec `python api.py`

# Frontend


# Interrogations actuelles

- [ ] - D'ou proviennent les informations concernant les grimpeurs de club ? (Et éventuellement quelles infos sur eux dont on dispose)
        C'est Nico chaque début d'année qui rentre toutes les grimpeurs du club, et seulement le prénom et le nom
- [ ] - Comment se déroule la gestion des cours et des scolaires ?
        Same que club !
- [ ] - A-t-on réellement besoin du site web des clubs ?

- Adresse/code postal/Ville nécessaire
- No limit carte 10 entrées
- Notes ??
- Reglement intérieur, signement durée



# Cahier des charges
- [ ] Entrer un client
- [ ] Entrer un achat
- [ ] Enregistrer un paiement

# Etat des lieux

## Documents a disposition

- Règlement intérieur
- Signature du règlement intérieur ticket séance
- Signature du règlement intérieur, abonnements et carte de 10
- Compta achat d'entrée
- Compta achat de bouffe
- Logiciel entrée abonnement annuel / mensuel
- Fiche excel Cuc/pt Gag (club)
- Fiche excel planning semaine
- Fiche excel planning année
- Tampon date pour ticket séance
- Ticket séance avec prix et type de payement
- Doc carte à faire/refaire
- Carte 10 entrées
- Carte abonnement
- Location chausson/baudrier+descendeur



## Info a stocker

### Client

- Nom
- Prénom
- Date de naissance
- Adresse
- Code postal 
- Ville 
- Tél
- E-Mail
- Tarifs Particulier, Etu/Famille/... ??
- Type d'entrée, abo/séance/10
- Date d'inscription
- Club
- Licencié + num 
- Notes ?
- Lit-on les achats annexes au compte du client (à vérifier)


# Idée

- Peut chercher la personne avec son numéro ou son prénom/nom
- Pour les entrées/abonnements faire en sorte d'appuyer sur le tarif voulu dans le tableau des entrées


# Point de vue client

Client classique :

    - Se créer un compte:
        - Procédure
        - signature réglement intérieur

    - S'identifier (code / nom prénom ...):
        - Modifier des infos de compte

           Prendre une séance
        OU Prendre carte de 10
        OU Prendre abonnement (trimestre, année)
        
        - Appliquer les potentielles réduction (licence / tarif réduit / âge)
        - Achats annexes potentiels
        
        - Paiement

Membre de club :

    - S'identifier
    Achats annexes potentiels:
        - Paiement

Achats annexes :

    - chausson
    - baudrier + descendeur
    - magnésie

Bar :

    Consommables
    Paiement (pas de chèque)

Paiement :

    - carte 
    - espèce
    - chèque
