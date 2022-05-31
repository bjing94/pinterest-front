import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorPage from "../pages/ErrorPages/ErrorPage";
import { ErrorPageProvider } from "../store/errorPageContext";

interface ErrorHandlerProps {
  children?: any;
}

// Hook to check if location changed
const useMyHistory = () => {
  const { pathname } = useLocation();
  const [currentKey, setCurrentKey] = useState(pathname);
  const [listenedFunctions, setListenedFunctions] = useState<(() => void)[]>(
    []
  );

  const listen = (func: () => void) => {
    setListenedFunctions([...listenedFunctions, func]);
  };

  if (pathname !== currentKey) {
    setCurrentKey(pathname);
    listenedFunctions.forEach((func) => {
      func.call(this);
    });
  }
  return { pathname, listen };
};

export default function ErrorHandler({ children }: ErrorHandlerProps) {
  const [errorPageData, setErrorPageData] = useState<{
    code: number;
    message: string;
  }>({ code: 0, message: "" });
  const history = useMyHistory();
  const { code, message } = errorPageData;

  const render = () => {
    if (code === 0) {
      return children;
    }
    return <ErrorPage code={code} message={message} />;
  };

  useEffect(() => {
    history.listen(() => {
      setErrorPageData({ code: 0, message: "" });
    });
  }, []);

  return (
    <ErrorPageProvider value={{ setErrorPageData }}>
      {render()}
    </ErrorPageProvider>
  );
}
