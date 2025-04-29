from sqlalchemy import String, ForeignKey
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column

from .Base import Casabase


class Grimpeur(Casabase):
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

    # Renvoi JSON
    def to_dict(self):
        return {
            "NumGrimpeur": self.NumGrimpeur,
            "NomGrimpeur": self.NomGrimpeur,
            "PrenomGrimpeur": self.PrenomGrimpeur,
            "DateNaissGrimpeur": (
                self.DateNaissGrimpeur.isoformat() if self.DateNaissGrimpeur else None
            ),
            "EmailGrimpeur": self.EmailGrimpeur,
            "TelGrimpeur": self.TelGrimpeur,
            "AdresseGrimpeur": self.AdresseGrimpeur,
            "VilleGrimpeur": self.VilleGrimpeur,
            "CodePostGrimpeur": self.CodePostGrimpeur,
            "DateInscrGrimpeur": self.DateInscrGrimpeur.isoformat(),
            "NbSeanceRest": self.NbSeanceRest,
            "Solde": self.Solde,
            "DateFincCotisation": (
                self.DateFincCotisation.isoformat() if self.DateFincCotisation else None
            ),
            "AccordReglement": self.AccordReglement,
            "SignaReglement": self.SignaReglement,
            "DateFinAbo": self.DateFinAbo.isoformat() if self.DateFinAbo else None,
            "DateFinCoti": self.DateFinCoti.isoformat() if self.DateFinCoti else None,
            "NumLicenceGrimpeur": self.NumLicenceGrimpeur,
            "TypeTicket": self.TypeTicket,
            "TypeAbo": self.TypeAbo,
        }
