import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  FC,
} from "react";

export interface ITrackingContext {
  activateMatomo: Boolean;
  setActivation: Dispatch<SetStateAction<Boolean>>;
}

export interface ITrackingContextProps {
  children?: ReactNode;
  initalActivation: Boolean;
}

/* eslint-disable no-unused-vars */
export const TrackingContext = createContext<ITrackingContext>({
  activateMatomo: false,
  setActivation: (value: SetStateAction<Boolean>) => {},
});
/* eslint-enable no-unused-vars */

export const TrackingProvider: FC<ITrackingContextProps> = ({
  initalActivation,
  children,
}) => {
  const [activate, setActivation] = useState(initalActivation);
  return (
    <TrackingContext.Provider
      value={{ activateMatomo: activate, setActivation }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
