'use client';

import { ClimberCard } from '@/src/components/clientCard';
import { useState } from 'react';

const testItems = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Grimpeur ${i + 1}`,
  level: ['Débutant', 'Intermédiaire', 'Expert'][i % 3],
}));

export default function SmartGrid() {
  const [expanded, setExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const initialItems = 9;
  const displayItems = expanded ? testItems : testItems.slice(0, initialItems - 1);

  return (
    <>
          {/* Partie principale fixe */}
          <div className={`mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-300`}>
            <h2 className="text-2xl font-bold text-blue-800">Section Fixe</h2>
            <p className="mt-2 text-blue-600">Ce contenu reste visible mais est flouté quand "Réussi" s'affiche</p>
          </div>
    <div className="container mx-auto p-8 relative">


      {/* Partie extensible des grimpeurs */}
      <div className={`relative transition-all ${
        expanded ? 'fixed inset-0 bg-white z-40 pt-8 pb-20 overflow-y-auto' : ''
      } ${showSuccess ? 'filter blur-sm' : ''}`}>
        <div className={`${expanded ? 'container mx-auto' : ''}`}>
          <h1 className="text-3xl font-bold mb-8">Liste des Grimpeurs</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className={`mt-2 px-3 py-1 rounded-full text-sm w-fit ${
                  item.level === 'Débutant' ? 'bg-blue-100 text-blue-800' :
                  item.level === 'Intermédiaire' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {item.level}
                </p>
              </div>
            ))}

            {!expanded && testItems.length >= initialItems && (
              <button
                onClick={() => setExpanded(true)}
                className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors"
              >
                <span className="text-2xl">+</span>
                <span className="font-medium mt-2">Voir {testItems.length - initialItems + 1} de plus</span>
              </button>
            )}
          </div>
        </div>

        {expanded && (
          <div className="sticky bottom-0 bg-white py-4 border-t border-gray-200">
            <div className="container mx-auto text-center">
              <button
                onClick={() => setExpanded(false)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Voir moins
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Partie masquable avec bouton "Réussi" */}
      <div className={`transition-all duration-300 ${
        expanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 mt-8'
      } ${showSuccess ? 'filter blur-sm' : ''}`}>
        <ClimberCard />
        
        <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200 relative">
          <h3 className="text-xl font-bold text-green-800">Validation</h3>
          <p className="mt-2 text-green-600">Cliquez pour confirmer la réussite</p>
          
          <button
            onClick={() => setShowSuccess(true)}
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            Valider la performance
          </button>
        </div>
      </div>

      {/* Overlay "Réussi" */}
      {showSuccess && (
          <div className="absolute inset-0 z-50 flex items-center justify-center  rounded-lg">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 border-4 border-green-400 animate-pop-in">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Réussi!</h3>
                <p className="text-gray-600 mb-6">La performance a été validée avec succès</p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
    </>
  );
}