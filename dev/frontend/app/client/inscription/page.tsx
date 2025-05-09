import { Metadata } from 'next';
import Breadcrumbs from '@/src/components/client_ui/breadcrumbs';
import Form from '@/src/components/client_ui/create-form';

export const metadata: Metadata = {
  title: 'Créer un Grimpeur',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Grimpeurs', href: '/dashboard/grimpeurs' },
          {
            label: 'Créer un Grimpeur',
            href: '/dashboard/grimpeurs/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}