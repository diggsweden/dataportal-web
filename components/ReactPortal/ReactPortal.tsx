import React from "react";
import { createPortal } from "react-dom";

interface ReactPortalProps {
  wrapperId: string;
  children?: React.ReactNode;
}

export const ReactPortal: React.FC<ReactPortalProps> = ({
  wrapperId,
  children,
}) => {
  return createPortal(children, (document as any)?.getElementById(wrapperId));
};

export default ReactPortal;
