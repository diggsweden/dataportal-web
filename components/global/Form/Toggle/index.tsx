import React, { FC } from "react";

export const Toggle: FC = () => (
  <div
    className="
    relative h-[1.5rem] w-[2.75rem] rounded-full bg-brown-400
    after:absolute after:start-[2px] after:top-[2px] after:h-[1.25rem] after:w-[1.25rem] after:rounded-full
    after:bg-brown-100
    after:shadow-sm
    after:transition-all
    after:content-['']
    peer-checked:bg-brown-800
    peer-checked:after:translate-x-full
    peer-focus-visible:outline-dashed 
    peer-focus-visible:outline-[3px]
    peer-focus-visible:outline-offset-2
    peer-focus-visible:outline-primary
    "
  />
);
