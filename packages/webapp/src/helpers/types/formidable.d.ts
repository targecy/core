// formidable-augmentations.d.ts

declare module 'formidable/src/helpers/firstValues.js' {
  import type { Formidable, Fields } from 'formidable';

  type FirstOrOriginalValueFields<T extends string = string> = {
    readonly [Prop in T]?: string | string[];
  };

  export function firstValues(form: Formidable, fields: Fields, exceptions?: string[]): FirstOrOriginalValueFields;
}

declare module 'formidable/src/helpers/readBooleans.js' {
  import type { Formidable, Fields } from 'formidable';

  type BooleanValueFields<T extends string = string> = {
    readonly [Prop in T]?: boolean;
  };

  export function readBooleans(fields: Fields | FirstOrOriginalValueFields, exceptions?: string[]): BooleanValueFields;
}
