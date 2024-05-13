import { useEffect } from 'react';
import { trackPageView } from '../../utils/tracking';
import { TargecyContext } from './Context';
import { environment } from '../../utils/context';
import { useTargecyContext } from '../../hooks/useTargecyContext';

export type TargecyTrackerProps = {
  children: React.ReactNode;
  env: environment;
  pathsToIgnore?: string[];
  pathsToTrack?: string[];
};

const shouldIgnorePath = (path: string, pathsToIgnore: string[] = [], pathsToTrack: string[] = []): boolean => {
  if (pathsToTrack.length > 0) {
    // If pathsToTrack is defined, only track those paths
    return !pathsToTrack.some((p) => path.includes(p));
  }

  // If pathsToIgnore is defined, ignore those paths
  return pathsToIgnore.some((p) => path.includes(p));
};

const Tracker = ({ children, env, pathsToIgnore, pathsToTrack }: TargecyTrackerProps) => {
  const path = typeof window === 'undefined' ? undefined : window.location.href;
  const context = useTargecyContext();

  useEffect(() => {
    if (!path || shouldIgnorePath(new URL(path).pathname, pathsToIgnore, pathsToTrack)) return;
    trackPageView({ path }, env, context.zkServices);
  }, [path]);

  return children;
};

export const TargecyTracker = (props: TargecyTrackerProps) => {
  return (
    <TargecyContext>
      <Tracker {...props}>{props.children}</Tracker>
    </TargecyContext>
  );
};
