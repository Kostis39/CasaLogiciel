from sqlalchemy import String, ForeignKey
from sqlalchemy_serializer import SerializerMixin
from datetime import date, time
from sqlalchemy.orm import Mapped, mapped_column

from .Base import Casabase


class Grimpeur(Casabase, SerializerMixin):
    __tablename__ = "Grimpeur"

    NumGrimpeur: Mapped[int] = mapped_column(primary_key=True)
    NomGrimpeur: Mapped[str] = mapped_column(String(50), nullable=False)
    PrenomGrimpeur: Mapped[str] = mapped_column(String(50), nullable=False)
    DateNaissGrimpeur: Mapped[date] = mapped_column(nullable=True)
    EmailGrimpeur: Mapped[str] = mapped_column(String(50), nullable=True)
    TelGrimpeur: Mapped[int] = mapped_column(nullable=True)
    AdresseGrimpeur: Mapped[str] = mapped_column(String(90), nullable=True)
    VilleGrimpeur: Mapped[str] = mapped_column(String(50), nullable=True)
    CodePostGrimpeur: Mapped[int] = mapped_column(nullable=True)
    DateInscrGrimpeur: Mapped[date] = mapped_column(nullable=False)
    NbSeanceRest: Mapped[int] = mapped_column(nullable=True)
    Solde: Mapped[int] = mapped_column(nullable=False, default=0)
    DateFincCotisation: Mapped[date] = mapped_column(nullable=True)
    AccordReglement: Mapped[bool] = mapped_column(nullable=True)
    SignaReglement: Mapped[str] = mapped_column(String(50), nullable=False)
    DateFinAbo: Mapped[date] = mapped_column(nullable=True)
    DateFinCoti: Mapped[date] = mapped_column(nullable=True)
    NumLicenceGrimpeur: Mapped[int] = mapped_column(nullable=True)

    # Clés étrangères
    TypeTicket: Mapped[str] = mapped_column(
        String(50), ForeignKey("Ticket.TypeTicket"), nullable=True
    )
    TypeAbo: Mapped[str] = mapped_column(
        String(50), ForeignKey("Abonnement.TypeAbo"), nullable=True
    )

    # Renvoi visuel debug
    def __repr__(self) -> str:
        return (
            f"Grimpeur("
            f"NumGrimpeur={self.NumGrimpeur}, "
            f"NomGrimpeur='{self.NomGrimpeur}', "
            f"PrenomGrimpeur='{self.PrenomGrimpeur}', "
            f"DateNaissGrimpeur='{self.DateNaissGrimpeur}', "
            f"EmailGrimpeur='{self.EmailGrimpeur}', "
            f"TelGrimpeur={self.TelGrimpeur}, "
            f"AdresseGrimpeur='{self.AdresseGrimpeur}', "
            f"VilleGrimpeur='{self.VilleGrimpeur}', "
            f"CodePostGrimpeur={self.CodePostGrimpeur}, "
            f"DateInscrGrimpeur='{self.DateInscrGrimpeur}', "
            f"NbSeanceRest={self.NbSeanceRest}, "
            f"Solde={self.Solde}, "
            f"DateFincCotisation='{self.DateFincCotisation}', "
            f"AccordReglement={self.AccordReglement}, "
            f"SignaReglement='{self.SignaReglement}', "
            f"DateFinAbo='{self.DateFinAbo}', "
            f"DateFinCoti='{self.DateFinCoti}', "
            f"NumLicenceGrimpeur={self.NumLicenceGrimpeur}"
            f")"
        )


class Ticket(Casabase):
    __tablename__ = "Ticket"

    TypeTicket: Mapped[str] = mapped_column(primary_key=True)
    NbSeanceTicket: Mapped[int] = mapped_column(nullable=False)
    DateFinValidite: Mapped[date] = mapped_column(nullable=False)

    def __repr__(self):
        return (
            f"Ticket("
            f"TypeTicket='{self.TypeTicket}', "
            f"NbSeanceTicket={self.NbSeanceTicket}, "
            f"DateFinValidite='{self.DateFinValidite}'"
            f")"
        )


class Abonnement(Casabase):
    __tablename__ = "Abonnement"

    TypeAbo: Mapped[str] = mapped_column(primary_key=True)
    NbSeanceAbo: Mapped[int] = mapped_column(nullable=False)
    DateFinValidite: Mapped[date] = mapped_column(nullable=False)


class Seance(Casabase):
    __tablename__ = "Seance"

    IdSeance: Mapped[int] = mapped_column(primary_key=True)
    DateSeance: Mapped[date] = mapped_column(nullable=False)
    HeureSeance: Mapped[time] = mapped_column(nullable=False)
    TypeEntree: Mapped[str] = mapped_column()

    NumGrimpeur: Mapped[int] = mapped_column(
        ForeignKey("Grimpeur.NumGrimpeur"), nullable=False
    )


class Transaction(Casabase):
    __tablename__ = "Transaction"

    IdTransac: Mapped[int] = mapped_column(primary_key=True)
    ModePaiment: Mapped[str] = mapped_column(nullable=False)
    DateTransac: Mapped[date] = mapped_column(nullable=False)
    HeureTransac: Mapped[time] = mapped_column(nullable=False)
    MontantFinalTransac: Mapped[float] = mapped_column(nullable=False)
    Note: Mapped[str] = mapped_column(String(100), nullable=True)

    NumGrimpeur: Mapped[int] = mapped_column(
        ForeignKey("Grimpeur.NumGrimpeur"), nullable=False
    )


class Reduction(Casabase):
    __tablename__ = "reduction"

    IdReduc: Mapped[int] = mapped_column(primary_key=True)
    NomReduc: Mapped[str] = mapped_column(nullable=False, unique=True)
    TypeReduc: Mapped[str] = mapped_column(nullable=False)
    TypeCalcul: Mapped[str] = mapped_column(nullable=False)
    Calcul: Mapped[float] = mapped_column(nullable=False)


class Produit(Casabase):
    __tablename__ = "produit"

    IdProduit: Mapped[int] = mapped_column(primary_key=True)
    NomProduit: Mapped[str] = mapped_column(nullable=False)
    TypeProduit: Mapped[str] = mapped_column(nullable=False)
    PrixProduit: Mapped[float] = mapped_column(nullable=True)
