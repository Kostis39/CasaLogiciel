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
    AccordReglement: Mapped[bool] = mapped_column(nullable=True)
    DateFinCoti: Mapped[date] = mapped_column(nullable=True)
    NumLicenceGrimpeur: Mapped[int] = mapped_column(nullable=True)

    # Renvoi visuel debug
    def __repr__(
        self,
    ) -> str:  # Exemple de base mais grace au serializer on peut utiliser .toDict()
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


class Ticket(Casabase, SerializerMixin):
    __tablename__ = "Ticket"

    IdTicket: Mapped[str] = mapped_column(primary_key=True, autoincrement=True)
    NumGrimpeur: Mapped[int] = mapped_column(
        ForeignKey("Grimpeur.NumGrimpeur"), nullable=False
    )
    NbSeanceTicket: Mapped[int] = mapped_column(nullable=False)


class Abonnement(Casabase, SerializerMixin):
    __tablename__ = "Abonnement"

    IdAbo: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    NumGrimpeur: Mapped[int] = mapped_column(
        ForeignKey("Grimpeur.NumGrimpeur"), primary_key=True
    )
    DateDebutValidite: Mapped[date] = mapped_column(nullable=False)
    DateFinValidite: Mapped[date] = mapped_column(nullable=False)


class Seance(Casabase, SerializerMixin):
    __tablename__ = "Seance"

    IdSeance: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    DateSeance: Mapped[date] = mapped_column(nullable=False)
    HeureSeance: Mapped[time] = mapped_column(nullable=False)
    TypeEntree: Mapped[str] = mapped_column()

    NumGrimpeur: Mapped[int] = mapped_column(
        ForeignKey("Grimpeur.NumGrimpeur"), nullable=False
    )


class Transaction(Casabase, SerializerMixin):
    __tablename__ = "Transaction"

    IdTransac: Mapped[int] = mapped_column(primary_key=True)
    IdProduit: Mapped[int] = mapped_column(
        ForeignKey("Produit.IdProduit"), nullable=False
    )
    ModePaiment: Mapped[str] = mapped_column(nullable=False)
    DateTransac: Mapped[date] = mapped_column(nullable=False)
    HeureTransac: Mapped[time] = mapped_column(nullable=False)
    MontantFinalTransac: Mapped[float] = mapped_column(nullable=False)
    Note: Mapped[str] = mapped_column(String(100), nullable=True)

    NumGrimpeur: Mapped[int] = mapped_column(
        ForeignKey("Grimpeur.NumGrimpeur"), nullable=True
    )


class Reduction(Casabase, SerializerMixin):
    __tablename__ = "Reduction"

    IdReduc: Mapped[int] = mapped_column(primary_key=True)
    NomReduc: Mapped[str] = mapped_column(nullable=False, unique=True)
    TypeReduc: Mapped[str] = mapped_column(nullable=False)
    TypeCalcul: Mapped[str] = mapped_column(nullable=False)
    Calcul: Mapped[float] = mapped_column(nullable=False)


class Produit(Casabase, SerializerMixin):
    __tablename__ = "Produit"

    IdProduit: Mapped[int] = mapped_column(primary_key=True)
    NomProduit: Mapped[str] = mapped_column(nullable=False)
    TypeProduit: Mapped[str] = mapped_column(nullable=False)
    IdReduc: Mapped[int] = mapped_column(ForeignKey("Reduction.IdReduc"), nullable=True)
    PrixProduit: Mapped[float] = mapped_column(nullable=True)
