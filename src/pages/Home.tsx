import React from "react";
import { FaPlus, FaQuestion } from "react-icons/fa";
import RoundButton from "../components/RoundButton/RoundButton";

export default function Home() {
  return (
    <>
      <RoundButton
        type="action"
        style={{ position: "fixed", right: "1rem", bottom: "10rem" }}
      >
        <FaPlus size={24} />
      </RoundButton>
      <RoundButton
        type="action"
        style={{ position: "fixed", right: "1rem", bottom: "5rem" }}
      >
        <FaQuestion size={24} />
      </RoundButton>
    </>
  );
}
