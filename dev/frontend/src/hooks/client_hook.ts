import { useEffect, useState } from "react";
import { Client } from "../types&fields/types";
import { fetchClientById } from "../services/api";


function useClientInfo( num : number | null ) {
    const [clientInfo, setClientInfo] = useState<Client | null>(null); 
    useEffect(() => { 
        if (num !== null) {
          fetchClientById(num).then(setClientInfo); 
          } else { 
            setClientInfo(null); 
          } }, [num]); 
    return clientInfo;
}

export { useClientInfo };