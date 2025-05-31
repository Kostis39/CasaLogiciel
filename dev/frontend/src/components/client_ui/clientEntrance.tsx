"use client";
import { SeanceClient } from "@/src/services/api";
import { Button } from "../ui/button";

export function ClientEntrance({num}:{num:number | null}){
    return (
        <Button /*
          onClick={async () => {
            if (num !== null) {
              await SeanceClient(num);
            }
          }}*/
        >
          Entrée
        </Button>
    );
}



