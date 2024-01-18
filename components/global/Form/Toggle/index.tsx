import React, { FC } from "react";

export const Toggle: FC = () => (
  <div
    className="
    peer
    relative h-[24px] w-[44px] rounded-full bg-brown-400
    after:absolute after:start-[2px] after:top-[2px] after:h-[20px] after:w-[20px] after:rounded-full
    after:bg-brown-100
    after:shadow-sm
    after:transition-all
    after:content-['']
    peer-checked:bg-brown-800
    peer-checked:after:translate-x-full
    peer-focus:outline-red-400
    "
  />
);
