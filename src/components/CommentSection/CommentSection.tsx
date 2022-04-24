import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { AiFillAmazonCircle, AiFillHeart, AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import convertAgeToString from "../../helpers/AgeToString";
import { getCurrentUser } from "../../services/AuthService";
import { createComment, getComment } from "../../services/CommentService";
import { getPin, updatePin } from "../../services/PinService";
import { CommentData, UserData } from "../../services/responses/responses";
import { getUser } from "../../services/UserService";
import { darkGray, red } from "../../styles/colors";
import AutoTextarea from "../AutoTextarea";
import Avatar from "../Avatar/Avatar";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import { ResponsiveInput } from "../ResponsiveInput/ResponsiveInput";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./CommentSection.scss";

interface CommentSectionProps {
  commentIds: string[];
  currentUserId: string;
  onCreate: any;
  onLike: any;
  onUseful: any;
}

interface CommentReplyProps {
  username: string;
  content: string;
  isLiked: boolean;
  isUseful: boolean;
  date: string;
  usefulCount: number;
}

interface CommentInputProps {
  show: boolean;
  onSubmit: any;
}

function CommentInput({ show, onSubmit }: CommentInputProps) {
  const [commentValue, setCommentValue] = useState("");
  const [buttonActive, setButtonActive] = useState(false);

  return (
    <Flexbox
      flexDirection="column"
      fluid
      style={{ display: `${show ? "block" : "none"}` }}
    >
      <div className="comment__input">
        <AutoTextarea
          onInput={(value: string) => {
            setButtonActive(value.length !== 0);
            setCommentValue(value);
          }}
          value={commentValue}
          placeholder="Your comment here"
        />
      </div>
      <Box margin="10px 0px 0px 0px" width="100%">
        <Flexbox fluid justifyContent="flex-end">
          <Button className="comment__input-cancel-btn">Cancel</Button>
          <Box margin="0px 0px 0px 10px">
            <Button
              className="comment__input-send-btn"
              active={buttonActive}
              onClick={() => {
                onSubmit(commentValue);
              }}
            >
              Send
            </Button>
          </Box>
        </Flexbox>
      </Box>
    </Flexbox>
  );
}

interface CommentContentDto {
  content: string;
  username: string;
  age: string;
}

function CommentContent({ content, username, age }: CommentContentDto) {
  return (
    <div className="comment__content">
      <Flexbox flexDirection="column" alignItems="flex-start">
        <Flexbox>
          <Typography fontSize={0.8} fontWeight="bold">
            {username}
          </Typography>
          <Typography fontSize={0.8} className="comment__date">
            {age}
          </Typography>
        </Flexbox>
        <Typography fontSize={0.8}>{content}</Typography>
      </Flexbox>
    </div>
  );
}

function CommentActions({
  liked,
  onClickLikeButton,
  onClickUsefulButton,
  useful,
  usefulCount,
}: {
  useful: boolean;
  liked: boolean;
  onClickLikeButton: any;
  onClickUsefulButton: any;
  usefulCount: number;
}) {
  return (
    <Flexbox justifyContent="space-between" className="comment__actions">
      <Flexbox>
        <RoundButton
          onClick={onClickLikeButton}
          className="comment__btn"
          size={24}
        >
          <AiFillHeart size={18} color={liked ? red : darkGray} />
        </RoundButton>
        <RoundButton className="comment__btn" size={24}>
          <FaComment size={18} color={darkGray} />
        </RoundButton>
        <RoundButton className="comment__btn" size={24}>
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
            {`Useful ${usefulCount}`}
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
  usefulCount,
}: CommentReplyProps) {
  const [liked, setLiked] = useState(isLiked);
  const [useful, setUseful] = useState(isUseful);
  return (
    <Flexbox alignItems="flex-start" className="reply__container">
      <RoundButton className="comment__avatar" size={32}>
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
          usefulCount={usefulCount}
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

interface CommentProps {
  show: boolean;
  comment: CommentData;
  isLiked: boolean;
  isUseful: boolean;
  onClickLikeButton: any;
  onClickUsefulButton: any;
}

function Comment({
  show,
  comment,
  isLiked,
  isUseful,
  onClickLikeButton,
  onClickUsefulButton,
}: CommentProps) {
  const [liked, setLiked] = useState(isLiked);
  const [useful, setUseful] = useState(isUseful);
  const [username, setUsername] = useState("");
  const [avatarId, setAvatarId] = useState("");

  useEffect(() => {
    getUser(comment.userId).then((response) => {
      if (!response || response.status !== 200) {
        return;
      }
      const userData = response.data as UserData;
      console.log(username);
      setUsername(userData.username);
      setAvatarId(userData.avatarSrc);
    });
  }, [comment]);

  return (
    <Flexbox
      className="comment__container"
      alignItems="flex-start"
      flexDirection="row"
      style={{ display: `${show && username ? "flex" : "none"}` }}
    >
      <Box margin="0px 5px 0px 0px">
        <Avatar size={36} imgId={avatarId} />
      </Box>

      <Flexbox
        alignItems="flex-start"
        flexDirection="column"
        style={{ width: "100%" }}
      >
        <CommentContent
          username={username}
          content={comment.content}
          age={convertAgeToString(new Date(comment.createdAt), new Date())}
        />
        <CommentActions
          liked={liked}
          useful={useful}
          usefulCount={5}
          onClickLikeButton={() => {
            onClickLikeButton(!liked);
            setLiked(!liked);
          }}
          onClickUsefulButton={() => {
            onClickUsefulButton(!useful);
            setUseful(!useful);
          }}
        />
        {/* <CommentReply
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
        /> */}
      </Flexbox>
    </Flexbox>
  );
}

export default function CommentSection({
  commentIds,
  currentUserId,
  onCreate,
  onLike,
  onUseful,
}: CommentSectionProps) {
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState<CommentData[]>([]);

  const getComments = async () => {
    const commentsResponse = await Promise.all(
      commentIds.map((id) => {
        return getComment(id);
      })
    );

    const newComments: CommentData[] = commentsResponse
      .map((response) => {
        if (response !== undefined && response.status === 200) {
          return response.data as CommentData;
        }
      })
      .filter((comment): comment is CommentData => {
        return comment !== undefined;
      });

    console.log(newComments);
    setComments(newComments);
  };

  useEffect(() => {
    getComments();
  }, [commentIds]);

  if (currentUserId.length === 0) {
    return <div></div>;
  }

  const commentElements = comments.map((comment) => {
    const isLiked = comment.likedBy.includes(currentUserId);
    const isUseful = comment.usefulBy.includes(currentUserId);
    return (
      <Comment
        isLiked={isLiked}
        isUseful={isUseful}
        comment={comment}
        show={showComments}
        onClickLikeButton={onLike}
        onClickUsefulButton={onUseful}
      />
    );
  });
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
          size={32}
        >
          <IoIosArrowForward size={24} />
        </RoundButton>
      </Flexbox>
      {commentElements}
      <CommentInput show={showComments} onSubmit={onCreate} />
    </Flexbox>
  );
}
