import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  FC,
} from "react";

export interface ITrackingContext {
  activateMatomo: boolean;
  setActivation: Dispatch<SetStateAction<boolean>>;
}

export interface ITrackingContextProps {
  children?: ReactNode;
  initalActivation: boolean;
}

export const TrackingContext = createContext<ITrackingContext>({
  activateMatomo: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActivation: (_value: SetStateAction<boolean>) => {},
});

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
