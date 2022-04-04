import React from "react";
import { FaPlus, FaQuestion } from "react-icons/fa";
import PinCard from "../../components/PinCard/PinCard";
import RoundButton from "../../components/RoundButton/RoundButton";

import "./Home.scss";

export default function Home() {
  return (
    <div className="home-grid">
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
      <PinCard
        src={
          "https://i.pinimg.com/236x/96/b2/ad/96b2ad9a1548d30f2ebdb12a638f9c1b.jpg"
        }
      />
      <PinCard
        src={
          "https://i.pinimg.com/236x/d4/7e/01/d47e013a97ae11c92d823db06755f06c.jpg"
        }
      />
      <PinCard
        src={
          "https://i.pinimg.com/236x/96/b2/ad/96b2ad9a1548d30f2ebdb12a638f9c1b.jpg"
        }
      />
      <PinCard
        src={
          "https://i.pinimg.com/236x/d4/7e/01/d47e013a97ae11c92d823db06755f06c.jpg"
        }
      />
      <PinCard
        src={
          "https://i.pinimg.com/236x/d4/7e/01/d47e013a97ae11c92d823db06755f06c.jpg"
        }
      />
      <PinCard
        src={
          "https://i.pinimg.com/236x/96/b2/ad/96b2ad9a1548d30f2ebdb12a638f9c1b.jpg"
        }
      />
      <PinCard
        src={
          "https://i.pinimg.com/236x/d4/7e/01/d47e013a97ae11c92d823db06755f06c.jpg"
        }
      />
      <PinCard
        src={
          "https://i.pinimg.com/236x/d4/7e/01/d47e013a97ae11c92d823db06755f06c.jpg"
        }
      />
    </div>
  );
}
