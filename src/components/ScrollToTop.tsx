import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Scroll to the element with the ID matching the hash
      const element = document.getElementById(hash.substring(1)); // Remove the '#' from the hash
      if (element) {
        element.scrollIntoView(); // optional: { behavior: 'smooth' }
      }
    } else {
      // No hash, scroll to the top of the page
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
