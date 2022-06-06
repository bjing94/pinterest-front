import { AxiosError } from "axios";
import React, { useContext, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { register, login } from "../../services/AuthService";
import { ErrorData } from "../../services/responses/responses";
import UserContext from "../../store/userContext";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import Input from "../Input";
import Popup from "../Popup";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./AuthPopup.scss";

interface AuthPopupProps {
  onClose: any;
  registerMode?: boolean;
}

export default function AuthPopup({
  onClose,
  registerMode = false,
}: AuthPopupProps) {
  const { setErrorPopup, setTextPopup } = useContext(UserContext);

  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);
  const displayIdRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleAuth = async () => {
    const email = emailRef?.current?.value;
    const password = passwordRef?.current?.value;
    const repeatPassword = repeatPasswordRef?.current?.value;
    const displayId = displayIdRef?.current?.value;
    const username = usernameRef?.current?.value;

    if (!email) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    if (registerMode) {
      if (!username) {
        setError("Please enter a name!");
        return;
      }

      if (!displayId) {
        setError("Please enter a unique id!");
        return;
      }

      if (!repeatPassword) {
        setError("Please repeat password");
        return;
      }

      if (password !== repeatPassword) {
        setError("Password don't match");
        return;
      }

      const res = await register({
        username: username,
        displayId: displayId,
        email: email,
        password: password,
      });

      if (res?.status === 201) {
        setTextPopup("User registered!");
        setError("");
        onClose();
      } else {
        setError(res?.data.message ?? "");
      }
    } else {
      const res = await login({ email: email, password: password }).catch(
        (error: AxiosError<ErrorData>) => {
          if (!error.response) return;
          setErrorPopup(error.response.data.message);
        }
      );
      if (res?.status === 200) {
        onClose();
        window.location.reload();
      } else {
        setError(res?.data.message ?? "");
      }
    }
  };
  return (
    <Popup
      containerClass="auth-popup__container"
      onClickBackground={onClose}
      data-testid="auth-popup"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleAuth();
        }}
      >
        <Flexbox flexDirection="column">
          <Box width="100%" margin="0px 0px 50px 0px">
            <RoundButton size={48} className="auth-popup__logo">
              <img alt="logo" className="logo" width={32} height={32} />
            </RoundButton>
            <RoundButton
              size={32}
              onClick={onClose}
              className="auth-popup__close"
              data-testid="auth-close"
            >
              <AiOutlineClose size={24} />
            </RoundButton>
          </Box>
          <div style={{ width: "100%" }}>
            <Typography>Welcome to Pinterest</Typography>
          </div>
          <Flexbox flexDirection="column" className="auth-popup__info">
            {error && (
              <Typography fontSize={12} color="error">
                {error}
              </Typography>
            )}
            {registerMode && (
              <>
                <Input
                  placeholder="my name"
                  className="auth-popup__input"
                  ref={usernameRef}
                  type="text"
                  data-testid="auth-username"
                />
                <Input
                  placeholder="super-id"
                  className="auth-popup__input"
                  ref={displayIdRef}
                  type="text"
                  data-testid="auth-id"
                />
              </>
            )}
            <Input
              placeholder="example@gmail.com"
              className="auth-popup__input"
              ref={emailRef}
              type="text"
              data-testid="auth-email"
            />
            <Input
              placeholder="awesome_password"
              className="auth-popup__input"
              ref={passwordRef}
              type="text"
              data-testid="auth-password"
            />
            {registerMode && (
              <>
                <Input
                  placeholder="awesome_password"
                  className="auth-popup__input"
                  ref={repeatPasswordRef}
                  type="text"
                  data-testid="auth-repeat-password"
                />

                <Button
                  data-testid="auth-register-btn"
                  className="auth-popup__register-button"
                  type="submit"
                >
                  Register
                </Button>
              </>
            )}
            {!registerMode && (
              <Button
                data-testid="auth-login-btn"
                className="auth-popup__login-button"
                type="submit"
              >
                Login
              </Button>
            )}
          </Flexbox>
        </Flexbox>
      </form>
    </Popup>
  );
}
