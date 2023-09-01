import { useContext } from 'react';
import { TargecyServicesContext } from './misc/Context';

export const UserIdentity = () => {
  const { userIdentity } = useContext(TargecyServicesContext);

  return <span> {userIdentity?.did.id} </span>;
};
