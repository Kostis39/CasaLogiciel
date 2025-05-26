'use client';
import { useState } from 'react';

// Types
type TopSectionProps = {
  fields: Field[];
  expandTop: boolean;
  expandBot: boolean;
  setExpandTop: (value: boolean) => void;
};

type BottomSectionProps = {
  expandBot: boolean;
  expandTop: boolean;
  setExpandBot: (value: boolean) => void;
};
type Field = { label: string; value: string | number };

// Composant principal
export function ClientMenu({ fields, alreadyEntered }: { fields: Field[], alreadyEntered?: boolean }) {
  const [expandTop, setExpandTop] = useState(false);
  const [expandBot, setExpandBot] = useState(false);

  return (
    
    <div className="container flex flex-col border border-black gap-2 h-full">
      <TopSection fields={fields} expandTop={expandTop} expandBot={expandBot} setExpandTop={setExpandTop} />
      <BottomSection expandBot={expandBot} expandTop={expandTop} setExpandBot={setExpandBot} />
    </div>
  );
}




// Partie haute
function TopSection({ fields, expandTop, expandBot, setExpandTop }: TopSectionProps) {
  const initialItems = 8;
  const displayedFields = expandTop ? fields : fields.slice(0, initialItems);

  return (
    <div
      className={`flex-1 transition-all duration-300
        ${!expandTop ? 'border border-amber-950' : ''}
        ${expandBot ? 'hidden opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
    >
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

          {!expandTop && fields.length > initialItems && (
            <button
              onClick={() => setExpandTop(true)}
              className="border border-dashed p-4 flex items-center justify-center"
            >
              <span className="text-2xl">+</span>
            </button>
          )}

          {expandTop && (
            <button
              onClick={() => setExpandTop(false)}
              className="border border-dashed px-6 py-3"
            >
              Voir moins
            </button>
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

