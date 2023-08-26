// Edit Ad

import { useRouter } from 'next/router';

import TargetGroupForm from '../editor';

export default function EditAd() {
  const router = useRouter();
  return TargetGroupForm(router.query.id?.toString());
}
