"use client";

import { useCallback, useEffect, useState } from "react";
import { Client } from "../types&fields/types";
import { fetchClientById, isAlreadyEntered } from "../services/api";


export function useClientInfo(num: number | null) {
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (num === null) {
      setClientInfo(null);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchClientById(num);
      setClientInfo(data);
    } catch (error) {
      console.error("Erreur de chargement client :", error);
    } finally {
      setLoading(false);
    }
  }, [num]);

  // charge automatiquement quand num change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // on expose la méthode de reload
  return { clientInfo, reloadClient: fetchData, loading };
}


export function useIsAlreadyEntered(numGrimpeur: number | null) {
  const [inCasa, setInCasa] = useState(false);

  useEffect(() => {
    if (!numGrimpeur) return;
    isAlreadyEntered(numGrimpeur)
      .then(setInCasa)
      .catch(() => setInCasa(false));
  }, [numGrimpeur]);

  return inCasa;
}

