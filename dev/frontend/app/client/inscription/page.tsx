import { Metadata } from 'next';
import {DraftForm} from '@/src/components/client_ui/create-form';

export const metadata: Metadata = {
  title: 'Créer un Grimpeur',
};

export default async function Page() {
  return (
    <main>
      <DraftForm />
    </main>
  );
}