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
