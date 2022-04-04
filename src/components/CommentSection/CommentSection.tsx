import React, { useState } from "react";
import { AiFillAmazonCircle, AiFillHeart, AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { darkGray, red } from "../../styles/colors";
import Flexbox from "../Flexbox/Flexbox";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./CommentSection.scss";

interface CommentReplyProps {
  username: string;
  content: string;
  isLiked: boolean;
  isUseful: boolean;
  date: string;
}

function CommentContent() {
  return (
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
        <Typography fontSize={0.8}>Sample textSample</Typography>
      </Flexbox>
    </div>
  );
}

function CommentActions({
  liked,
  onClickLikeButton,
  onClickUsefulButton,
  useful,
}: {
  useful: boolean;
  liked: boolean;
  onClickLikeButton: any;
  onClickUsefulButton: any;
}) {
  return (
    <Flexbox justifyContent="space-between" className="comment__actions">
      <Flexbox>
        <RoundButton onClick={onClickLikeButton} className="comment__btn">
          <AiFillHeart size={18} color={liked ? red : darkGray} />
        </RoundButton>
        <RoundButton className="comment__btn">
          <FaComment size={18} color={darkGray} />
        </RoundButton>
        <RoundButton className="comment__btn">
          <FiMoreHorizontal size={18} color={darkGray} />
        </RoundButton>
      </Flexbox>
      <button onClick={onClickUsefulButton} className="comment__btn-useful">
        <Flexbox>
          <AiFillLike
            size={18}
            color={useful ? red : darkGray}
            style={{ marginRight: "0.2rem" }}
          />
          <Typography fontSize={0.8} color={useful ? red : darkGray}>
            Useful 2
          </Typography>
        </Flexbox>
      </button>
    </Flexbox>
  );
}

function CommentReply({
  username,
  content,
  isLiked = false,
  isUseful = false,
  date,
}: CommentReplyProps) {
  const [liked, setLiked] = useState(isLiked);
  const [useful, setUseful] = useState(isUseful);
  return (
    <Flexbox alignItems="flex-start" className="reply__container">
      <RoundButton className="comment__avatar">
        <AiFillAmazonCircle size={32} />
      </RoundButton>
      <Flexbox
        alignItems="flex-start"
        flexDirection="column"
        style={{ flexGrow: 1 }}
      >
        <div className="comment__content">
          <Flexbox flexDirection="column" alignItems="flex-start">
            <Flexbox>
              <Typography fontSize={0.8} fontWeight="bold">
                {username}
              </Typography>
              <Typography fontSize={0.8} className="comment__date">
                {date}
              </Typography>
            </Flexbox>
            <Typography fontSize={0.8}>{content}</Typography>
          </Flexbox>
        </div>
        <CommentActions
          liked={liked}
          useful={useful}
          onClickLikeButton={() => {
            setLiked(!liked);
          }}
          onClickUsefulButton={() => {
            setUseful(!useful);
          }}
        />
      </Flexbox>
    </Flexbox>
  );
}

function Comment() {
  const [liked, setLiked] = useState(false);
  const [useful, setUseful] = useState(false);

  return (
    <Flexbox className="comment__container" alignItems="flex-start">
      <RoundButton className="comment__avatar">
        <AiFillAmazonCircle size={48} />
      </RoundButton>
      <Flexbox
        alignItems="flex-start"
        flexDirection="column"
        style={{ width: "100%" }}
      >
        <CommentContent />
        <CommentActions
          liked={liked}
          useful={useful}
          onClickLikeButton={() => {
            setLiked(!liked);
          }}
          onClickUsefulButton={() => {
            setUseful(!useful);
          }}
        />
        <CommentReply
          username="john"
          content="lol hecker is angry"
          isLiked={false}
          isUseful={false}
          date="14 weeks."
        />
        <CommentReply
          username="jake"
          content="floppers will flopp"
          isLiked={false}
          isUseful={false}
          date="14 weeks."
        />
      </Flexbox>
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
          Comments
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
        </>
      )}
    </Flexbox>
  );
}
