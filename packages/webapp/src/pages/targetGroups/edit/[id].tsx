// Edit Ad

import { useRouter } from 'next/router';

import { TargetGroupEditorComponent } from '../editor';

export default function EditAd() {
  const { query } = useRouter();

  return TargetGroupEditorComponent(query.id?.toString());
}
