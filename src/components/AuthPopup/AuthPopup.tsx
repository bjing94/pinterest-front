import React, { useContext, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { register, login } from "../../services/AuthService";
import UserContext from "../../store/userContext";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import Input from "../Input";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./AuthPopup.scss";

interface AuthPopupProps {
  onClose: any;
  onSubmit?: any;
  registerMode?: boolean;
}

export default function AuthPopup({
  onClose,
  onSubmit,
  registerMode = false,
}: AuthPopupProps) {
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

      if (password != repeatPassword) {
        setError("Password don't match");
        return;
      }

      const res = await register({
        username: username,
        displayId: displayId,
        email: email,
        password: password,
      });

      if (res?.status == 201) {
        setError("");
        onClose();
      } else {
        setError(res?.data.message ?? "");
      }
    } else {
      const res = await login({ email: email, password: password });
      if (res?.status == 200) {
        onClose();
        window.location.reload();
      } else {
        setError(res?.data.message ?? "");
      }
    }
  };

  return (
    <div className="auth-popup__background" onClick={onClose}>
      <div
        className="auth-popup__container"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAuth();
            onSubmit();
          }}
        >
          <Flexbox flexDirection="column">
            <Flexbox
              justifyContent="space-between"
              style={{ width: "100%", paddingLeft: "168px" }}
            >
              <RoundButton size={48}>
                <img className="logo" width={32} height={32} />
              </RoundButton>
              <RoundButton size={32} onClick={onClose}>
                <AiOutlineClose size={24} />
              </RoundButton>
            </Flexbox>
            <div style={{ width: "400px" }}>
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
                  />
                  <Input
                    placeholder="super-id"
                    className="auth-popup__input"
                    ref={displayIdRef}
                    type="text"
                  />
                </>
              )}
              <Input
                placeholder="example@gmail.com"
                className="auth-popup__input"
                ref={emailRef}
                type="text"
              />
              <Input
                placeholder="awesome_password"
                className="auth-popup__input"
                ref={passwordRef}
                type="text"
              />
              {registerMode && (
                <>
                  <Input
                    placeholder="awesome_password"
                    className="auth-popup__input"
                    ref={repeatPasswordRef}
                    type="text"
                  />

                  <Button className="auth-popup__register-button" type="submit">
                    Register
                  </Button>
                </>
              )}
              {!registerMode && (
                <Button className="auth-popup__login-button" type="submit">
                  Login
                </Button>
              )}
            </Flexbox>
          </Flexbox>
        </form>
      </div>
    </div>
  );
}
