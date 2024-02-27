import { useState } from 'react';

import { Preferences, getPreferences, savePreferences } from '~/utils/preferences';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    roles: [],
  });

  const updatePreferences = (newPreferences: Partial<Preferences>) => {
    const mergedPreferences = savePreferences(newPreferences);
    setPreferences(mergedPreferences);
  };

  const refreshPreferences = () => {
    setPreferences(getPreferences() ?? { roles: [] });
  };

  refreshPreferences();

  return { preferences, updatePreferences, refreshPreferences };
};
