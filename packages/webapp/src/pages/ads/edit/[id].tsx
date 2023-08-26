// Edit Ad

import { useRouter } from 'next/router';

import AdForm from '../editor';

export default function EditAd() {
  const router = useRouter();
  return AdForm(router.query.id?.toString());
}
