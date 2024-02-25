export const benefitsSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGDVSyTOyuWL8lWNfoJzisSj_30k6btrT7HloM3ls17NtVPNicnsm2CaPDa87pcH0YmT3F7joJqNcQ/pub?output=csv';
export const featuredSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRlNxGne0gyrXY-YP-9sg7CG9cnQQUA6QEf6iiAAgTR2sz62RB1NHOBi-zUIXdomDMGtSDxSjp9TVuI/pub?output=csv';

export type Benefit = {
  protocol: string;
  chain?: string;
  icon?: string;
  symbol?: string;
  tvl?: string;
  apy?: string;
  offer?: string;
  link: string;
};

export type Featured = Benefit;
