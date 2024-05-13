// Using TargecyServicesContext instead of repeat logic here
import { useContext } from "react";
import { TargecyContextType } from '../components/misc/Context.types';
import { TargecyServicesContext } from "../components/misc";

export const useTargecyContext = () => useContext<TargecyContextType>(TargecyServicesContext);