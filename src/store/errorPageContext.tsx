import React from "react";

interface ErrorPageContextInterface {
  setErrorPageData: ({
    code,
    message,
  }: {
    code: number;
    message: string;
  }) => void;
}

const ErrorPageContext = React.createContext<ErrorPageContextInterface>({
  setErrorPageData: () => {},
});
export const ErrorPageProvider = ErrorPageContext.Provider;
export default ErrorPageContext;
