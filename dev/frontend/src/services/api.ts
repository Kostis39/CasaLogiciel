const API_URL = 'http://localhost:5000'; // Adresse de votre API Flask

export const fetchGrimpeurById = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/grimpeurs/${id}`);
    if (!response.ok) {
      console.log(`Erreur HTTP: ${response.status}`);
      return false;
    }
    return await response.json();
    
  } catch (error) {
    console.error('Échec de la récupération du grimpeur:', error);
    throw error;
  }
};