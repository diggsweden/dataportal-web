import {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";

export interface ITrackingContext {
  activateMatomo: boolean;
  setActivation: Dispatch<SetStateAction<boolean>>;
}

export interface ITrackingContextProps {
  children?: ReactNode;
  initialActivation: boolean;
}

export const TrackingContext = createContext<ITrackingContext>({
  activateMatomo: false,
  setActivation: (_value: SetStateAction<boolean>) => {},
});

export const TrackingProvider: FC<ITrackingContextProps> = ({
  initialActivation,
  children,
}) => {
  const [activate, setActivation] = useState(initialActivation);

  return (
    <TrackingContext.Provider
      value={{ activateMatomo: activate, setActivation }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
