import React from "react";
import { Buttons } from "../components/Button";

export const Hero = () => {
  return (
    <div className="flex flex-col w-[1512px] h-[1109px] items-center gap-14 pt-[100px] pb-14 px-[120px] relative bg-[color:var(--colors-primary-900)]">
      <div className="flex items-center gap-8 self-stretch w-full flex-col relative flex-[0_0_auto]">
        <p className="relative w-[1042px] [font-family:'Roboto-Light',Helvetica] font-light text-colors-neutral-150 text-[22px] text-center tracking-[0] leading-9">
          Unlock the future of wealth creation with CareHub Exchange, your
          trusted peer-to-peer trading and investment platform. Experience
          secure, transparent, and profitable trading
        </p>

        <Buttons
          className="!rounded-[20px] !flex ![background:linear-gradient(90deg,rgba(213,239,111,1)_0%,rgba(218,195,224,1)_100%)] !bg-[unset] !w-[200px]"
          hierarchy="filled"
          label="Get Started"
          rightIcon={false}
          size="LG"
          stateProp="default"
        />
      </div>

      <div className="inline-flex items-start gap-2.5 p-2.5 bg-[color:var(--colors-primary-900)] rounded-[30px] border-[6px] border-solid border-[#a4bf3c33] shadow-shadow-3 opacity-80 flex-col relative flex-[0_0_auto]">
        {/* <img
          className="relative w-[1012px] h-[537px] mt-[-6.00px] ml-[-6.00px]"
          alt="Image"
          src={image13}
        /> */}
      </div>
    </div>
  );
};
