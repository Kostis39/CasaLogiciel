'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const API_URL = 'http://localhost:5000';

const GrimpeurSchema = z.object({
  id: z.string(),
  nomGrimpeur: z.string({
    invalid_type_error: 'Veuillez entrer un nom valide',
  }).min(1, { message: 'Le nom est requis' }),
  prenomGrimpeur: z.string({
    invalid_type_error: 'Veuillez entrer un prénom valide',
  }).min(1, { message: 'Le prénom est requis' }),
  dateNaissGrimpeur: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Format de date invalide (AAAA-MM-JJ)',
  }),
  emailGrimpeur: z.string().email({
    message: 'Veuillez entrer un email valide',
  }),
  telGrimpeur: z.string().min(10, {
    message: 'Le numéro doit contenir au moins 10 caractères',
  }),
  adresseGrimpeur: z.string().min(1, {
    message: 'L\'adresse est requise',
  }),
  villeGrimpeur: z.string().min(1, {
    message: 'La ville est requise',
  }),
  codePostGrimpeur: z.string().regex(/^\d{5}$/, {
    message: 'Le code postal doit contenir 5 chiffres',
  }),
});

const CreateGrimpeur = GrimpeurSchema.omit({ id: true});
const UpdateGrimpeur = GrimpeurSchema.omit({ id: true });

export type State = {
  errors?: {
    nomGrimpeur?: string[];
    prenomGrimpeur?: string[];
    dateNaissGrimpeur?: string[];
    emailGrimpeur?: string[];
    telGrimpeur?: string[];
    adresseGrimpeur?: string[];
    villeGrimpeur?: string[];
    codePostGrimpeur?: string[];
  };
  message?: string | null;
};

export async function createGrimpeur(prevState: State, formData: FormData) {
  const validatedFields = CreateGrimpeur.safeParse({
    nomGrimpeur: String(formData.get('nomGrimpeur') ?? ''),
    prenomGrimpeur: String(formData.get('prenomGrimpeur') ?? ''),
    dateNaissGrimpeur: String(formData.get('dateNaissGrimpeur') ?? ''),
    emailGrimpeur: String(formData.get('emailGrimpeur') ?? ''),
    telGrimpeur: String(formData.get('telGrimpeur') ?? ''),
    adresseGrimpeur: String(formData.get('adresseGrimpeur') ?? ''),
    villeGrimpeur: String(formData.get('villeGrimpeur') ?? ''),
    codePostGrimpeur: String(formData.get('codePostGrimpeur') ?? ''),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants ou invalides. Échec de la création.',
    };
  }

  const { 
    nomGrimpeur,
    prenomGrimpeur,
    dateNaissGrimpeur,
    emailGrimpeur,
    telGrimpeur,
    adresseGrimpeur,
    villeGrimpeur,
    codePostGrimpeur
  } = validatedFields.data;

  try {
    const response = await fetch(`${API_URL}/grimpeurs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        NumGrimpeur: 11,
        NomGrimpeur: nomGrimpeur,
        PrenomGrimpeur: prenomGrimpeur,
        DateNaissGrimpeur: dateNaissGrimpeur,
        EmailGrimpeur: emailGrimpeur,
        TelGrimpeur: telGrimpeur,
        AdresseGrimpeur: adresseGrimpeur,
        VilleGrimpeur: villeGrimpeur,
        CodePostGrimpeur: codePostGrimpeur,
        DateInscrGrimpeur: new Date().toISOString().split('T')[0],
        Solde: 0,
        AccordReglement: true // ou false
      })
    });
    if (!response.ok) throw new Error('Erreur API');
  } catch (error) {
    return {
      message: 'Erreur lors de la création du grimpeur.',
    };
  }
  
  //revalidatePath('/client');
  //redirect('/client');
}

export async function updateGrimpeur(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = CreateGrimpeur.safeParse({
    nomGrimpeur: String(formData.get('nomGrimpeur') ?? ''),
    prenomGrimpeur: String(formData.get('prenomGrimpeur') ?? ''),
    dateNaissGrimpeur: String(formData.get('dateNaissGrimpeur') ?? ''),
    emailGrimpeur: String(formData.get('emailGrimpeur') ?? ''),
    telGrimpeur: String(formData.get('telGrimpeur') ?? ''),
    adresseGrimpeur: String(formData.get('adresseGrimpeur') ?? ''),
    villeGrimpeur: String(formData.get('villeGrimpeur') ?? ''),
    codePostGrimpeur: String(formData.get('codePostGrimpeur') ?? ''),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants ou invalides. Échec de la mise à jour.',
    };
  }

  const { 
    nomGrimpeur,
    prenomGrimpeur,
    dateNaissGrimpeur,
    emailGrimpeur,
    telGrimpeur,
    adresseGrimpeur,
    villeGrimpeur,
    codePostGrimpeur
  } = validatedFields.data;

  try {
    const response = await fetch(`/api/grimpeurs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nom: nomGrimpeur,
        prenom: prenomGrimpeur,
        date_naissance: dateNaissGrimpeur,
        email: emailGrimpeur,
        telephone: telGrimpeur,
        adresse: adresseGrimpeur,
        ville: villeGrimpeur,
        code_postal: codePostGrimpeur
      })
    });
    if (!response.ok) throw new Error('Erreur API');
  } catch (error) {
    return { message: 'Erreur lors de la mise à jour du grimpeur.' };
  }

  revalidatePath('/client');
  redirect('/client');
}

export async function deleteGrimpeur(id: string) {
  try {
    const response = await fetch(`/api/grimpeurs/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur API');
    
    revalidatePath('/client');
  } catch (error) {
    return { message: 'Erreur lors de la suppression du grimpeur.' };
  }
}