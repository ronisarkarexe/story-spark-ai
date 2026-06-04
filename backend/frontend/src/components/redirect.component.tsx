import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type RedirectComponentProps = {
  defaultPath?: string;
};

const RedirectComponent = ({ defaultPath = "/" }: RedirectComponentProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = location.state && location.state.from ? location.state.from : defaultPath;
    
    if (redirectPath !== location.pathname) {
      navigate(redirectPath);
    }
  }, [location, navigate, defaultPath]);

  return null;
};

export default RedirectComponent;

