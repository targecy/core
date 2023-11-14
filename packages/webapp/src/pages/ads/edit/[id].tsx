// Edit Ad

import { useRouter } from 'next/router';

import { AdEditorComponent } from '../editor';

const EditAdPage = () => {
  const { query } = useRouter();

  return AdEditorComponent(query.id?.toString());
};

export default EditAdPage;
