import React, { useState } from "react";
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
  onUpdate: (dto: UpdateUserDto) => void;
}

export default function EditUserPopup({
  title,
  onClose,
  onUpdate,
  userData,
}: EditPopupProps) {
  const [currentUsername, setCurrentUsername] = useState(userData.username);
  const [currentDisplayId, setCurrentDisplayId] = useState(userData.displayId);
  const [currentEmail, setCurrentEmail] = useState(userData.email);
  const [newPassword, setNewPassword] = useState("");

  const mainContent = (
    <Box className="edit-user-popup__content">
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
    currentUsername !== userData.username;

  const bottomContent = (
    <>
      <Flexbox fluid justifyContent="space-between">
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={() => {
            onUpdate({
              username: currentUsername,
              displayId: currentDisplayId,
              newPassword: newPassword,
            });
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
