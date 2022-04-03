import React, { useRef, useState } from "react";
import { BaseStyle } from "../../types/types";
import Flexbox from "../Flexbox/Flexbox";

import "./Input.scss";
interface InputProps extends BaseStyle {
  placeholder?: string;
  tip?: string;
  fontSize?: string;
  symbolsLimit?: number;
}
export const Input = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ style, placeholder, tip, symbolsLimit, fontSize }, ref) => {
    const [showTip, setShowTip] = useState(false);
    const [currentValue, setCurrentValue] = useState("");
    const [symbolsRemaining, setSymbolsRemaining] = useState(symbolsLimit);

    const styles: React.CSSProperties = {
      "--input-content": ` '${currentValue}'`,
    } as React.CSSProperties;

    return (
      <div className="input-container" style={{ ...styles, fontSize }}>
        <textarea
          name="text"
          onInput={(event) => {
            if (symbolsLimit) {
              if (event.currentTarget.value.length <= symbolsLimit) {
                setCurrentValue(event.currentTarget.value);
                setSymbolsRemaining(
                  symbolsLimit - event.currentTarget.value.length
                );
              }
            } else {
              setCurrentValue(event.currentTarget.value);
            }
          }}
          onFocus={() => {
            setShowTip(true);
          }}
          onBlur={() => {
            setShowTip(false);
          }}
          rows={1}
          placeholder={placeholder}
          style={style}
          value={currentValue}
          ref={ref}
        ></textarea>
        <Flexbox
          className="input-tip"
          alignItems="flex-start"
          justifyContent="space-between"
          style={{ visibility: showTip ? "visible" : "hidden" }}
        >
          <div className="input-tip__text">{tip}</div>
          {symbolsLimit && (
            <div className="input-tip__limit">{symbolsRemaining}</div>
          )}
        </Flexbox>
      </div>
    );
  }
);
// export default function Input({
//   style,
//   placeholder,
//   tip,
//   symbolsLimit,
//   fontSize,
// }: InputProps) {
//   const [showTip, setShowTip] = useState(false);
//   const [currentValue, setCurrentValue] = useState("");
//   const [symbolsRemaining, setSymbolsRemaining] = useState(symbolsLimit);

//   const styles: React.CSSProperties = {
//     "--input-content": ` '${currentValue}'`,
//   } as React.CSSProperties;

//   return (
//     <div className="input-container" style={{ ...styles, fontSize }}>
//       <textarea
//         name="text"
//         onInput={(event) => {
//           if (symbolsLimit) {
//             if (event.currentTarget.value.length <= symbolsLimit) {
//               setCurrentValue(event.currentTarget.value);
//               setSymbolsRemaining(
//                 symbolsLimit - event.currentTarget.value.length
//               );
//             }
//           } else {
//             setCurrentValue(event.currentTarget.value);
//           }
//         }}
//         onFocus={() => {
//           setShowTip(true);
//         }}
//         onBlur={() => {
//           setShowTip(false);
//         }}
//         rows={1}
//         placeholder={placeholder}
//         style={style}
//         value={currentValue}
//         ref={ref}
//       ></textarea>
//       <Flexbox
//         className="input-tip"
//         alignItems="flex-start"
//         justifyContent="space-between"
//         style={{ visibility: showTip ? "visible" : "hidden" }}
//       >
//         <div className="input-tip__text">{tip}</div>
//         {symbolsLimit && (
//           <div className="input-tip__limit">{symbolsRemaining}</div>
//         )}
//       </Flexbox>
//     </div>
//   );
// }
