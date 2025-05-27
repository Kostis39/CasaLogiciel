import { Metadata } from 'next';
import Form from '@/src/components/client_ui/create-form';

export const metadata: Metadata = {
  title: 'Créer un Grimpeur',
};

export default async function Page() {
  return (
    <main>
      <Form />
    </main>
  );
}