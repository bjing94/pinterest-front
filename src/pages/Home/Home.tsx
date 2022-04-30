import React, { useEffect, useState } from "react";
import { FaPlus, FaQuestion } from "react-icons/fa";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import RoundButton from "../../components/RoundButton/RoundButton";
import Toolbar from "../../components/Toolbar/Toolbar";
import { getRandomPins } from "../../services/PinService";

import "./Home.scss";

const breakpointColumnsObj = {
  default: 7,
  1820: 6, // 1800 or less
  1600: 5,
  1400: 4,
  1100: 3,
  900: 2,
  600: 1,
};

export default function Home() {
  const [pinsIds, setPinIds] = useState<string[]>([]);

  useEffect(() => {
    const getPins = async () => {
      const data = await getRandomPins();
      if (data) {
        setPinIds(
          data.map((pin) => {
            return pin._id;
          })
        );
      }
    };

    getPins();
  }, []);

  const pinCards = pinsIds.map((id) => {
    return (
      <Flexbox
        justifyContent="center"
        style={{ width: "100%" }}
        key={`pin-card-${id}`}
      >
        <PinCard
          isSaved={false}
          boards={[]}
          onSetBoardId={() => {}}
          onSavePin={() => {}}
          onShowCreateBoard={() => {}}
          pinId={id}
        />
      </Flexbox>
    );
  });

  return (
    <div className="home-container">
      <Toolbar />
      <Link to="/pin-builder">
        <RoundButton
          type="action"
          style={{ position: "fixed", right: "1rem", bottom: "10rem" }}
          size={48}
        >
          <FaPlus size={24} />
        </RoundButton>
      </Link>
      <RoundButton
        type="action"
        style={{ position: "fixed", right: "1rem", bottom: "5rem" }}
        size={48}
      >
        <FaQuestion size={24} />
      </RoundButton>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pinCards}
      </Masonry>
    </div>
  );
}
