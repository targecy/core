export type UserRole = 'user' | 'creator' | 'business' | 'publisher';
// eslint-disable-next-line @typescript-eslint/ban-types
export type Preferences = {};

export const getPreferences = (): Preferences | undefined => {
  const storedPreferences = localStorage.getItem('preferences');
  if (storedPreferences) {
    return JSON.parse(storedPreferences);
  }
};

export const savePreferences = (newPreferences: Partial<Preferences>) => {
  const preferences = getPreferences() ?? { roles: [] };

  const mergedPreferences = { ...preferences, ...newPreferences };
  localStorage.setItem('preferences', JSON.stringify(mergedPreferences));

  return mergedPreferences;
};
