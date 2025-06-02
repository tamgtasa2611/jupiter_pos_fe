import { atom } from "recoil";
import { useMediaQuery } from "react-responsive";

// Define the atom for mobile detection state
export const isMobileAtom = atom({
  key: "isMobileAtom", // unique ID (with respect to other atoms/selectors)
  default: false, // default value
});

// Hook to use the mobile detection and update the atom
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
  key: "currentUserAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value
});
