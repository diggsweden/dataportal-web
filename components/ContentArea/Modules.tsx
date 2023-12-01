import React from "react";
import { ModuleDataFragment } from "../../graphql/__generated__/operations";
import ContentArea from "./ContentArea";

export const Modules: React.FC<ModuleDataFragment> = ({ blocks }) => {
  return <ContentArea blocks={blocks || []} />;
};

export default Modules;
