import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./InputSearch.scss";

interface InputSearchProperties {
  placeholder?: string;
  onChange?: any;
  onInput?: any;
  value?: any;
}
const InputSearch = ({
  placeholder,
  onChange,
  onInput,
  value,
  ...rest
}: InputSearchProperties) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [isActive, setIsActive] = useState(false);
  return (
    <div className={`input-search-container ${isActive ? "active" : ""}`}>
      {!inputFocus && !isActive && (
        <AiOutlineSearch data-testid="input-search-icon" size={18} />
      )}
      <input
        placeholder={placeholder}
        onFocus={() => {
          setInputFocus(true);
        }}
        onBlur={() => {
          setInputFocus(false);
        }}
        onInput={(event: any) => {
          if (event.currentTarget.value !== "") {
            setIsActive(true);
          } else {
            setIsActive(false);
          }
          onInput(event);
        }}
        onChange={onChange}
        value={value}
        {...rest}
      />
    </div>
  );
};

export default InputSearch;
