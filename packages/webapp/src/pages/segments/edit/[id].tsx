import { useRouter } from 'next/router';

import { SegmentEditorComponent } from '../editor';

export default function EditSegment() {
  const { query } = useRouter();

  return SegmentEditorComponent(query.id?.toString());
}
