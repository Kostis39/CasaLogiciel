import * as z from "zod";

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
export const formSchema = z.object({
  NomGrimpeur: z.string(),
  PrenomGrimpeur: z.string(),
  DateNaissGrimpeur: z.string().optional().optional(),
  TelGrimpeur: z.string().optional().optional(),
  EmailGrimpeur: z.string().email().optional(),
  NumLicenceGrimpeur: z.number().optional(),
  Club: z.string().optional().optional(),
  StatutVoie: z.string().optional(),
  TypeAbo: z.string().optional(),
  DateFinAbo: z.string().optional().optional(),
  TypeTicket: z.string().optional(),
  NbSeanceRest: z.number().optional(),
  DateFinCoti: z.boolean().default(false).optional(),
  AccordReglement: z.boolean(),
  AccordParental: z.boolean().optional(),
  Note: z.string().optional(),
});
