import React, { useState } from "react";
import { AiFillAmazonCircle } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import Flexbox from "../Flexbox/Flexbox";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./CommentSection.scss";

function Comment() {
  return (
    <Flexbox className="comment__container" alignItems="flex-start">
      <RoundButton className="comment__avatar">
        <AiFillAmazonCircle size={48} />
      </RoundButton>
      <div className="comment__content">
        <Flexbox flexDirection="column" alignItems="flex-start">
          <Flexbox>
            <Typography fontSize={0.8} fontWeight="bold">
              username
            </Typography>
            <Typography fontSize={0.8} className="comment__date">
              14 weeks.
            </Typography>
          </Flexbox>
          <Typography fontSize={0.8}>
            Sample textSample textSample text Sample text Sample text Sample
            textSample textSample textSample text Sample text Sample text Sample
            textSample textSample textSample text Sample text Sample text Sample
            text
          </Typography>
        </Flexbox>
      </div>
    </Flexbox>
  );
}

export default function CommentSection() {
  const [showComments, setShowComments] = useState(true);
  return (
    <Flexbox
      flexDirection="column"
      alignItems="flex-start"
      className="comment-section"
    >
      <Flexbox style={{ marginTop: "4rem" }}>
        <Typography fontSize={1.2} fontWeight="bold">
          Комментарии
        </Typography>
        <RoundButton
          onClick={() => {
            setShowComments(!showComments);
          }}
          style={{ transform: `${showComments ? "rotate(90deg)" : ""}` }}
          className="comment-section__btn"
        >
          <IoIosArrowForward size={24} />
        </RoundButton>
      </Flexbox>
      {showComments && (
        <>
          <Comment />
          <Comment />
          <Comment />
        </>
      )}
    </Flexbox>
  );
}
