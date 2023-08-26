import { useRouter } from 'next/router';

import ZKPRequestForm from '../editor';

export default function EditZKPRequest() {
  const router = useRouter();
  return ZKPRequestForm(router.query.id?.toString());
}
