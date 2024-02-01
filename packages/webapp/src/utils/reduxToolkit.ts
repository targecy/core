import { Action, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import type { RootState } from '~/store';

export function isHydrateAction(action: Action): action is PayloadAction<RootState> {
  return action.type === HYDRATE;
}
