import React, { useRef, useState } from "react";
import Box from "../../../../components/Box/Box";
import Button from "../../../../components/Button/Button";
import Flexbox from "../../../../components/Flexbox/Flexbox";
import Input from "../../../../components/Input";
import { UpdateUserDto } from "../../../../services/dto/update-user.dto";
import { UserData } from "../../../../services/responses/responses";
import EditPopup from "../../../../components/EditPopup/EditPopup";

import "./EditUserPopup.scss";

interface TextPropertyProps {
  label: string;
  value: string;
  onInput: any;
  id: string;
}

function TextProperty({ label, value, onInput, id }: TextPropertyProps) {
  return (
    <Box width="100%" margin="0px 0px 20px 0px">
      <Flexbox
        className="text-property"
        fluid
        justifyContent="space-between"
        alignItems="center"
      >
        <Box margin="0px 50px 0px 0px">
          <label htmlFor={id}>{label}</label>
        </Box>
        <Input
          placeholder="test"
          value={value}
          onInput={onInput}
          className="edit-pin-popup__input"
          id={id}
        />
      </Flexbox>
    </Box>
  );
}

interface EditPopupProps {
  userData: UserData;
  title: string;
  onClose: () => void;
  onUpdate: (dto: UpdateUserDto, newAvatar?: File) => void;
  avatarSrc: string;
}

export default function EditUserPopup({
  title,
  onClose,
  onUpdate,
  userData,
  avatarSrc,
}: EditPopupProps) {
  const [currentUsername, setCurrentUsername] = useState(userData.username);
  const [currentDisplayId, setCurrentDisplayId] = useState(userData.displayId);
  const [currentEmail, setCurrentEmail] = useState(userData.email);
  const [newPassword, setNewPassword] = useState("");
  const [imgSrc, setImgSrc] = useState(avatarSrc);
  const [newAvatar, setNewAvatar] = useState<File | undefined>(undefined);

  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImg = () => {
    if (imgInputRef && imgInputRef.current && imgInputRef.current.files) {
      const selectedFile = imgInputRef.current.files[0];
      setNewAvatar(selectedFile);
      const fr = new FileReader();

      fr.onload = function () {
        if (fr.result) {
          setImgSrc(`${fr.result?.toString()}`);
        }
      };

      fr.readAsDataURL(selectedFile);
    }
  };

  const mainContent = (
    <Box className="edit-user-popup__content">
      <Box margin="0px 0px 20px 0px">
        <Flexbox justifyContent="center" fluid>
          <div
            className="edit-user-popup__avatar-input"
            style={{ backgroundImage: `url(${imgSrc})` }}
          >
            <label htmlFor="avatar-input">Change image?</label>
            <input
              ref={imgInputRef}
              onInput={handleUploadImg}
              type="file"
              id="avatar-input"
            />
          </div>
        </Flexbox>
      </Box>
      <TextProperty
        label="Username"
        value={currentUsername}
        onInput={(event: any) => {
          setCurrentUsername(event.target.value);
        }}
        id={"username"}
      />
      <TextProperty
        label="Display id"
        value={currentDisplayId}
        onInput={(event: any) => {
          setCurrentDisplayId(event.target.value);
        }}
        id={"displayId"}
      />
      <TextProperty
        label="Email"
        value={currentEmail}
        onInput={(event: any) => {
          setCurrentEmail(event.target.value);
        }}
        id={"email"}
      />
      <TextProperty
        label="New password"
        value={newPassword}
        onInput={(event: any) => {
          setNewPassword(event.target.value);
        }}
        id={"password"}
      />
    </Box>
  );

  const hasChanged =
    newPassword !== "" ||
    currentEmail !== userData.email ||
    currentDisplayId !== userData.displayId ||
    currentUsername !== userData.username ||
    avatarSrc !== imgSrc;

  const bottomContent = (
    <>
      <Flexbox fluid justifyContent="space-between">
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={() => {
            onUpdate(
              {
                username: currentUsername,
                displayId: currentDisplayId,
                newPassword: newPassword,
              },
              newAvatar
            );
            onClose();
          }}
          active={hasChanged}
        >
          Save
        </Button>
      </Flexbox>
    </>
  );
  return (
    <EditPopup
      onClose={onClose}
      title={title}
      mainContent={mainContent}
      bottomContent={bottomContent}
    />
  );
}
