// Edit Ad

import { useRouter } from 'next/router';

import { AudienceEditorComponent } from '../editor';

export default function EditAd() {
  const { query } = useRouter();

  return AudienceEditorComponent(query.id?.toString());
}
