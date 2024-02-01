import { Action, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import type { IRootState } from './store';

export function isHydrateAction(action: Action): action is PayloadAction<IRootState> {
  return action.type === HYDRATE;
}
