import { Metadata } from 'next';
import {DraftForm} from '@/src/components/client_ui/clientForm';

export const metadata: Metadata = {
  title: 'Créer un Grimpeur',
};

export default async function Page() {
  return (
    <div className="overflow-auto flex flex-col p-8 rounded-md border">
      <DraftForm />
    </div>
  );
}