from sqlalchemy import String
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import Mapped, mapped_column

from .Base import Casabase


# Ce fichier contient tous les modèles ORM en relation avec les groupes club et scolaires

# En lien avec les clubs
class Club(Casabase, SerializerMixin):
    __tablename__ = "Club"

    IdClub: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    NomClub: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    CodePostClub: Mapped[int] = mapped_column(String(20), nullable=True)
    VilleClub: Mapped[str] = mapped_column(String(50), nullable=True)
    TelClub: Mapped[int] = mapped_column(String(20), nullable=True)
    EmailClub: Mapped[str] = mapped_column(String(50), nullable=True)
    AdresseClub: Mapped[str] = mapped_column(String(90), nullable=True)
    SiteInternet: Mapped[str] = mapped_column(String(150), nullable=True)

"""
class Creneau(Casabase, SerializerMixin):
    __tablename__ = "Creneau"

    IdCreneau: Mapped[int] = mapped_column(primary_key=True)
    DateCreneau: Mapped[date] = mapped_column()
    HeureDeb: Mapped[time] = mapped_column()
    HeureFin: Mapped[time] = mapped_column()
    TypeCreneau: Mapped[str] = mapped_column(String(50))
    NbPersonnes: Mapped[int] = mapped_column()

class GrimpeurClub(Casabase, SerializerMixin):
    __tablename__ = "GrimpeurClub"

    IdGrClub: Mapped[int] = mapped_column(primary_key=True)
    PrenomGrClub: Mapped[str] = mapped_column(String(50))
    NomGrClub: Mapped[str] = mapped_column(String(50))
    IdClub: Mapped[int] = mapped_column(ForeignKey("Club.IdClub"))


class CreneauClub(Casabase, SerializerMixin):
    __tablename__ = "CreneauClub"

    IdCreneau: Mapped[int] = mapped_column(
        ForeignKey("Creneau.IdCrenau"), primary_key=True
    )
    IdClub: Mapped[int] = mapped_column(ForeignKey("Club.IdClub"), primary_key=True)


class SeanceClub(Casabase, SerializerMixin):
    __tablename__ = "SeanceClub"
    IdGrClub: Mapped[int] = mapped_column(
        ForeignKey("GrimpeurClub.IdGrClub"), primary_key=True
    )
    IdCreneau: Mapped[int] = mapped_column(
        ForeignKey("Creneau.IdCreneau"), primary_key=True
    )
    IdClub: Mapped[int] = mapped_column(ForeignKey("Club.IdClub"), primary_key=True)


# En lien avec les scolaires
class Etablissement(Casabase, SerializerMixin):
    __tablename__ = "Etablissement"

    IdEtab: Mapped[int] = mapped_column(primary_key=True)
    NomEtab: Mapped[str] = mapped_column(String(50))
    NomRef: Mapped[str] = mapped_column(String(50))


class CreneauEtab(Casabase, SerializerMixin):
    __tablename__ = "CreneauEtab"

    IdCreneau: Mapped[int] = mapped_column(
        ForeignKey("Creneau.IdCrenau"), primary_key=True
    )
    IdEtab: Mapped[int] = mapped_column(
        ForeignKey("Etablissement.IdEtab"), primary_key=True
    )
"""