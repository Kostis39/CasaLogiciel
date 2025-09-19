"use client";

import { ClientGrid } from "@/src/components/client_ui/clientInfo";
import { ClientListClientComponent } from "@/src/components/client_ui/clientListDefault";
import SearchClient from "@/src/components/client_ui/clientSearch";
import { useClientInfo, useIsAlreadyEntered } from "@/src/hooks/client_hook";
import { isAlreadyEntered } from "@/src/services/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Saisies(){
	const searchParams = useSearchParams();
	const query = searchParams.get("query") || '';
	const id = searchParams.get("id") || '';
	const num = id ? Number(id) : null;

	const clientInfo = useClientInfo(num);


	return (
		<div className="flex flex-col gap-1">
			<div>
				<SearchClient />
			</div>

			<div className="grid gap-1" style={{gridTemplateColumns: "1fr 5fr"}}>
				{/* Client Search and List */}
				<div className="flex flex-col overflow-auto h-[96vh]">
					<ClientListClientComponent query={query} />
				</div>

				{/* Client Info */}
			{!clientInfo ? (
				<p>Aucun client sélectionné.</p>
			) : (
				<ClientGrid clientInfo={clientInfo} />
			)}
			</div>
			
				
		</div>
	);
}