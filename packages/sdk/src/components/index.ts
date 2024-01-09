export { Ad } from './Ad';
export type { AdProps } from './Ad';

// ! THIS COULD BE A BREAKING CHANGE IF SOMEONE ALREADY USING THE SDK !
//export type { BaseAdStyling } from './BaseAd'; previous export
// export type { AdLayoutStyling } from './AdLayout'; // new export

export type { AdLayoutStyling as BaseAdStyling } from './AdLayout'; // new export
