import { useRouter } from 'next/router';

import ZKPRequestForm from '../editor';

export default function EditZKPRequest() {
  const router = useRouter();

  console.log(router.query);
  return ZKPRequestForm(router.query.id?.toString());
}
