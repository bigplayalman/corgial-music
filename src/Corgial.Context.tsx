import { createContext } from "react";
import CorgialStore from "./corgial.store";

const CorgialContext = createContext({} as CorgialStore);
export const CorgialProvider = CorgialContext.Provider;
export const CorgialConsumer = CorgialContext.Consumer;

export default CorgialContext;
