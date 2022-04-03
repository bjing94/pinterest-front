import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./InputSearch.scss";

interface InputSearchProperties {
  placeholder?: string;
}

export default function InputSearch({ placeholder }: InputSearchProperties) {
  const [inputFocus, setInputFocus] = useState(false);
  return (
    <div className="input-search-container">
      {!inputFocus && <AiOutlineSearch size={18} />}
      <input
        placeholder={placeholder}
        onFocus={() => {
          setInputFocus(true);
        }}
        onBlur={() => {
          setInputFocus(false);
        }}
      />
    </div>
  );
}
