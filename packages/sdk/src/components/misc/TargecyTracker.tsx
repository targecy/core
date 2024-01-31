import { useContext, useEffect } from 'react';
import { trackPageView } from '../../utils/tracking';
import { TargecyContext, TargecyServicesContext } from './Context';
import { environment } from '../../utils/context';

export type TargecyTrackerProps = {
  children: React.ReactNode;
  env: environment;
};

const Tracker = ({ children, env }: TargecyTrackerProps) => {
  const path = typeof window === 'undefined' ? undefined : window.location.href;

  useEffect(() => {
    if (!path) return;

    trackPageView({ path }, env);
  }, [path]);

  return children;
};

export const TargecyTracker = ({ children, env }: TargecyTrackerProps) => {
  return (
    <TargecyContext>
      <Tracker env={env}>{children}</Tracker>
    </TargecyContext>
  );
};
