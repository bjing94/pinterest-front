import React, { FormEvent, ReactPropTypes, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./InputSearch.scss";

interface InputSearchProperties {
  placeholder?: string;
  onChange?: any;
}
const InputSearch = React.forwardRef<
  HTMLInputElement,
  InputSearchProperties & React.InputHTMLAttributes<HTMLInputElement>
>(({ placeholder, onChange, ...rest }, ref) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`input-search-container ${isActive ? "active" : ""}`}>
      {!inputFocus && !isActive && <AiOutlineSearch size={18} />}
      <input
        placeholder={placeholder}
        onFocus={() => {
          setInputFocus(true);
        }}
        onBlur={() => {
          setInputFocus(false);
        }}
        onInput={(event: FormEvent<HTMLInputElement>) => {
          if (event.currentTarget.value !== "") {
            setIsActive(true);
          } else {
            setIsActive(false);
          }
        }}
        onChange={onChange}
        ref={ref}
        {...rest}
      />
    </div>
  );
});

export default InputSearch;
