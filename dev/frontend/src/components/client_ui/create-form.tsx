'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  CakeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/button';
import { createGrimpeur, State } from '@/src/lib/actions';
import { useActionState } from 'react';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createGrimpeur, initialState);
  
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nom du grimpeur */}
        <div className="mb-4">
          <label htmlFor="nomGrimpeur" className="mb-2 block text-sm font-medium">
            Nom du grimpeur
          </label>
          <div className="relative">
            <input
              id="nomGrimpeur"
              name="nomGrimpeur"
              type="text"
              placeholder="Entrez le nom"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="nomGrimpeur-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="nomGrimpeur-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nomGrimpeur &&
              state.errors.nomGrimpeur.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Prénom du grimpeur */}
        <div className="mb-4">
          <label htmlFor="prenomGrimpeur" className="mb-2 block text-sm font-medium">
            Prénom du grimpeur
          </label>
          <div className="relative">
            <input
              id="prenomGrimpeur"
              name="prenomGrimpeur"
              type="text"
              placeholder="Entrez le prénom"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="prenomGrimpeur-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="prenomGrimpeur-error" aria-live="polite" aria-atomic="true">
            {state.errors?.prenomGrimpeur &&
              state.errors.prenomGrimpeur.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Date de naissance */}
        <div className="mb-4">
          <label htmlFor="dateNaissGrimpeur" className="mb-2 block text-sm font-medium">
            Date de naissance
          </label>
          <div className="relative">
            <input
              id="dateNaissGrimpeur"
              name="dateNaissGrimpeur"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="dateNaissGrimpeur-error"
            />
            <CakeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="dateNaissGrimpeur-error" aria-live="polite" aria-atomic="true">
            {state.errors?.dateNaissGrimpeur &&
              state.errors.dateNaissGrimpeur.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="emailGrimpeur" className="mb-2 block text-sm font-medium">
            Adresse email
          </label>
          <div className="relative">
            <input
              id="emailGrimpeur"
              name="emailGrimpeur"
              type="email"
              placeholder="Entrez l'email"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="emailGrimpeur-error"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="emailGrimpeur-error" aria-live="polite" aria-atomic="true">
            {state.errors?.emailGrimpeur &&
              state.errors.emailGrimpeur.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Téléphone */}
        <div className="mb-4">
          <label htmlFor="telGrimpeur" className="mb-2 block text-sm font-medium">
            Numéro de téléphone
          </label>
          <div className="relative">
            <input
              id="telGrimpeur"
              name="telGrimpeur"
              type="tel"
              placeholder="Entrez le numéro de téléphone"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="telGrimpeur-error"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="telGrimpeur-error" aria-live="polite" aria-atomic="true">
            {state.errors?.telGrimpeur &&
              state.errors.telGrimpeur.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Adresse */}
        <div className="mb-4">
          <label htmlFor="adresseGrimpeur" className="mb-2 block text-sm font-medium">
            Adresse
          </label>
          <div className="relative">
            <input
              id="adresseGrimpeur"
              name="adresseGrimpeur"
              type="text"
              placeholder="Entrez l'adresse"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="adresseGrimpeur-error"
            />
            <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="adresseGrimpeur-error" aria-live="polite" aria-atomic="true">
            {state.errors?.adresseGrimpeur &&
              state.errors.adresseGrimpeur.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Ville */}
        <div className="mb-4">
          <label htmlFor="villeGrimpeur" className="mb-2 block text-sm font-medium">
            Ville
          </label>
          <div className="relative">
            <input
              id="villeGrimpeur"
              name="villeGrimpeur"
              type="text"
              placeholder="Entrez la ville"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="villeGrimpeur-error"
            />
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="villeGrimpeur-error" aria-live="polite" aria-atomic="true">
            {state.errors?.villeGrimpeur &&
              state.errors.villeGrimpeur.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Code postal */}
        <div className="mb-4">
          <label htmlFor="codePostGrimpeur" className="mb-2 block text-sm font-medium">
            Code postal
          </label>
          <div className="relative">
            <input
              id="codePostGrimpeur"
              name="codePostGrimpeur"
              type="text"
              placeholder="Entrez le code postal"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="codePostGrimpeur-error"
            />
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="codePostGrimpeur-error" aria-live="polite" aria-atomic="true">
            {state.errors?.codePostGrimpeur &&
              state.errors.codePostGrimpeur.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/client"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Annuler
        </Link>
        <Button type="submit">Créer Grimpeur</Button>
      </div>
    </form>
  );
}