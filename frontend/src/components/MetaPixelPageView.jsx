import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MetaPixelPageView = () => {
  const location = useLocation();
  const isFirstPageView = useRef(true);

  useEffect(() => {
    if (isFirstPageView.current) {
      isFirstPageView.current = false;
      return;
    }

    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname, location.search]);

  return null;
};

export default MetaPixelPageView;
