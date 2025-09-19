"use client";

import { useCallback, useEffect, useState } from "react";
import { Client } from "../types&fields/types";
import { fetchClientById, isAlreadyEntered } from "../services/api";


export function useClientInfo( num : number | null ) {
    const [clientInfo, setClientInfo] = useState<Client | null>(null); 
    useEffect(() => { 
        if (num !== null) {
          fetchClientById(num).then(setClientInfo); 
          } else { 
            setClientInfo(null); 
          } }, [num]); 
    return clientInfo;
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

