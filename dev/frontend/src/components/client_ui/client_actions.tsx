import { deleteSeance, isAlreadyEntered, postSeanceClient } from "@/src/services/api";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function ButtonsActions({numGrimpeur} : {numGrimpeur: number}) {
    const [inCasa, setInCasa] = useState<boolean>(false);

    useEffect(() => {
    const fetchEnteredStatus = async () => {
        if (numGrimpeur === null) {
        setInCasa(false);
        return;
        }
        try {
        const status = await isAlreadyEntered(numGrimpeur);
        setInCasa(status);
        } catch (error) {
        console.error("Erreur lors de la vérification du statut d'entrée :", error);
        setInCasa(false);
        }
    };
    fetchEnteredStatus();
    }, [numGrimpeur]);

    const handleClick1 = () => {
        postSeanceClient(numGrimpeur);
    };
    const handleClick2 = () => {
        deleteSeance(numGrimpeur);
    };

    if (!inCasa){
        return (
            <div>
                {inCasa}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2">
            <Button onClick={handleClick1} variant="outline">
            Entrée
            </Button>

            <Button onClick={handleClick2} variant="outline">
            Annuler Entree
            </Button>
        </div>
    );

}
