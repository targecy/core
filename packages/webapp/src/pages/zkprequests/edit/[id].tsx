import { useRouter } from 'next/router';

import { ZKPRequestEditorComponent } from '../editor';

export default function EditZKPRequest() {
  const { query } = useRouter();

  return ZKPRequestEditorComponent(query.id?.toString());
}
