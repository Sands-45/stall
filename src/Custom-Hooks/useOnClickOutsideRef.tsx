import { useEffect, useRef } from "react";

let useClickOutside = (handler: any, restrict?: string) => {
  let dropDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let closeHandler = (event: any) => {
      if (event.target && dropDownRef && dropDownRef.current) {
        if (
          !dropDownRef.current.contains(event.target) ||
          event?.target.tagName?.toLowerCase() === restrict?.toLowerCase()
        ) {
          handler();
        }
      }
    };

    document.addEventListener("mousedown", closeHandler, true);

    return () => document.removeEventListener("mousedown", closeHandler, true);
  });

  return dropDownRef;
};

export default useClickOutside;
