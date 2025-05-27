'use client';
import { isAlreadyEntered } from '@/src/services/clientApi';
import { useState } from 'react';
import { Button } from '../ui/button';


type TopSectionProps = {
  clientInfo: Client;
  expandTop: boolean;
  expandBot: boolean;
  setExpandTop: (value: boolean) => void;
};

type BottomSectionProps = {
  expandBot: boolean;
  expandTop: boolean;
  setExpandBot: (value: boolean) => void;
};

// Composant principal
export function ClientMenu({ clientInfo }: { clientInfo: Client}) {
  const [expandTop, setExpandTop] = useState(false);
  const [expandBot, setExpandBot] = useState(false);
  const rep = isAlreadyEntered(clientInfo.NumGrimpeur);
  
  return (
      <div className="container flex flex-col border border-black gap-2 h-full relative">
        <TopSection clientInfo={clientInfo} expandTop={expandTop} expandBot={expandBot} setExpandTop={setExpandTop} />
        <BottomSection expandBot={expandBot} expandTop={expandTop} setExpandBot={setExpandBot} />
      </div>
  );
}




// Partie haute
function TopSection({ clientInfo, expandTop, expandBot, setExpandTop }: TopSectionProps) {
    const fieldInfoClient = [
      { label: "Nom", value: clientInfo.NomGrimpeur },
      { label: "Prénom", value: clientInfo.PrenomGrimpeur },
      { label: "Date de naissance", value: clientInfo.DateNaissGrimpeur },
      { label: "Numéro de grimpeur", value: clientInfo.NumGrimpeur },
      { label: "Numéro de licence", value: clientInfo.NumLicenceGrimpeur },
      { label: "Téléphone", value: clientInfo.TelGrimpeur },
      { label: "Email", value: clientInfo.EmailGrimpeur },
      { label: "Adresse", value: clientInfo.AdresseGrimpeur },
      { label: "Code postal", value: clientInfo.CodePostGrimpeur },
      { label: "Ville", value: clientInfo.VilleGrimpeur },
      { label: "Type d'abonnement", value: clientInfo.TypeAbo ?? "—" },
      { label: "Type de ticket", value: clientInfo.TypeTicket ?? "—" },
      { label: "Fin d'abonnement", value: clientInfo.DateFinAbo },
      { label: "Fin de cotisation", value: clientInfo.DateFinCoti },
      { label: "Nombre de séances restantes", value: clientInfo.NbSeanceRest },
      { label: "Solde", value: clientInfo.Solde + " €" },
      { label: "Date d'inscription", value: clientInfo.DateInscrGrimpeur },
      { label: "Accord règlement", value: clientInfo.AccordReglement ? "Oui" : "Non" },
    ];
  const initialItems = 8;
  const displayedFields = expandTop ? fieldInfoClient : fieldInfoClient.slice(0, initialItems);

  return (
    <div
      className={`flex-1 transition-all duration-300
        ${!expandTop ? 'border border-amber-950' : ''}
        ${expandBot ? 'hidden opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
    >
      {/* Petit message qui est sensé s'afficher seulement si le Bot ne 
      prends pas toute la place et si le grimpeur est déjà rentrée */}
      {!expandBot && isAlreadyEntered(clientInfo.NumGrimpeur) ? (
        <p className="absolute left-10 text-red-600">Est déjà rentré aujourd'hui</p>
          ) : (
          <p></p>
      )}
      {/* Conteneur principal avec image + tableau */}
      <div className="flex gap-5 items-center justify-center h-full">
        
        {/* Image à gauche */}
        <div className="flex-[1]">
            <img 
            src="/avatar.png"
            alt="Grimpeur" 
            className="w-full h-auto rounded"
              />
        </div>

        {/* Grille des grimpeurs */}
        <div className="flex-[4] grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedFields.map(({ label, value }) => (
            <div key={label} className="border p-2 rounded bg-white shadow">
              <strong className="block text-sm font-semibold text-gray-700">{label}</strong>
              <span className="text-base">{value}</span>
            </div>
          ))}

          {!expandTop && fieldInfoClient.length > initialItems && (
            <>
              <button
                onClick={() => setExpandTop(true)}
                className="border border-dashed p-4 flex items-center justify-center"
              >
                <span className="text-2xl">+</span>
              </button>
            </>

          )}

          {expandTop && (
            <>
              <Button
              size={"lg"}
                className="absolute top-2 right-2 bg-blue-600 text-white "
                onClick={() => alert('Romain doit faire ce boutton')}
                >
                Modifier
              </Button>
              <button
                onClick={() => setExpandTop(false)}
                className="border border-dashed px-6 py-3"
              >
                Voir moins
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


// Partie basse
function BottomSection({ expandBot, expandTop, setExpandBot }: BottomSectionProps) {
  const buttons = ['Entrée', 'Achat Entrée', 'Achat Abonnement', 'Achat Annexe'];

  return (
    <div
      className={`flex-1 flex items-center justify-center transition-all duration-300
        ${!expandBot ? 'border border-blue-700' : ''}
        ${expandTop ? 'hidden opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
    >
      <div className="grid grid-cols-2 grid-rows-2 gap-5">
        {buttons.map((label) => (
          <button
            key={label}
            onClick={() => setExpandBot(true)}
            className="border p-2"
          >
            {label}
          </button>
        ))}

        {expandBot && (
          <button
            onClick={() => setExpandBot(false)}
            className="border p-2 col-span-2"
          >
            Retour
          </button>
        )}
      </div>
    </div>
  );
}

