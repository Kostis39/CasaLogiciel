'use client';
import { useState } from 'react';

const testItems = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Grimpeur ${i + 1}`,
  level: ['Débutant', 'Intermédiaire', 'Expert'][i % 3],
}));

export function Content(){
      const [expandTop, setexpandTop] = useState(false);
      const [expandBot, setexpandBot] = useState(false);
      const initialItems = 8;
      /* Si on ne veut pas étendre on limite le nombre d'infos affiché */
      const displayItems = expandTop ? testItems : testItems.slice(0, initialItems);
    
      return (    
        <div className="container flex flex-col border border-black gap-2 h-full">

          {/* Partie Haute, si on veut étendre le bas on hidden le haut et les bordures servent juste au débug*/}
          <div className={`
            ${expandTop ? '' : 'border border-amber-950'} 
            ${expandBot ? 'hidden opacity-0 h-0 overflow-hidden' : 'opacity-100'}
            flex-1`
            }>

            {/* Affichage de toutes les données d'un grimpeur */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayItems.map((item) => (
                <div key={item.id} className="border">
                  <h3>{item.name}</h3>
                  <p>{item.level}</p>
                </div>
              ))}

              {/* Si on ne veut pas étendre on limite le nombre d'infos affiché */}
              {!expandTop && testItems.length >= initialItems && (
                <button
                  onClick={() => setexpandTop(true)}
                  className="justify-center border-1 border-dashed"
                >
                  <p className="text-2xl">+</p>
                </button>
              )}
    
            {/* Le boutton pour ramener à la normale */}
            {expandTop && (
                <button
                  onClick={() => setexpandTop(false)}
                  className="px-6 py-3  border-1 border-dashed"
                >
                  Voir moins
                </button>
              )}
            </div>
          </div>
    
          {/* Partie basse, si on veut étendre le haut on hidden le bas et les bordures servent juste au débug*/}
          <div className={`
            ${expandBot ? '' : 'border border-blue-700'} 
            ${expandTop ? 'hidden opacity-0 h-0 overflow-hidden' : 'opacity-100'}
            flex-1 flex items-center justify-center`
            }>
            
            {/* Pour l'instant ici sont juste affiché des bouttons pour passer d'un état à un autre mais c'est possible de faire en sorte que de nouvelle infos soit affiché */}
            <div className='grid grid-cols-2 grid-rows-2 gap-5'>

              <button
                onClick={() => setexpandBot(true)}
                className="border-1">
                Entrée
              </button>

              <button
                onClick={() => setexpandBot(true)}
                className="border-1">
                Achat Entrée
              </button>

              <button
                onClick={() => setexpandBot(true)}
                className="border-1">
                Achat Abonnement
              </button>

              <button
                onClick={() => setexpandBot(true)}
                className="border-1">
                Achat Annexe
              </button>

            {/* Le boutton pour ramener à la normale */}
              {expandBot && (
                <button
                  onClick={() => setexpandBot(false)}
                  className="border-1">
                  Retour
                </button>
              )}

            </div>

          </div>
    
        </div>

      );
}