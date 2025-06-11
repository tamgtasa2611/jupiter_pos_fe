import { atom } from "recoil";
import { useMediaQuery } from "react-responsive";

export const isMobileAtom = atom({
  key: "isMobileAtom",
  default: false, // default value
});

export const useIsMobile = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return isMobile;
};

export const useMobileStyles = () => {
  const defaultStyles = {
    input: { height: "40px", fontSize: "16px" },
    select: { height: "40px" },
    switch: {},
    formItem: { marginBottom: "16px" },
    button: { height: "40px", padding: "0 16px", fontSize: "16px" },
  };

  const isMobile = useIsMobile();

  return isMobile ? defaultStyles : {};
};

export const currentUserAtom = atom({
  key: "currentUserAtom",
  default: null,
});
