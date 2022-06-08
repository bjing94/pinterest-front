import React, { HTMLAttributes } from "react";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { darkGray } from "../../styles/colors";
import { BaseStyle } from "../../types/types";
import "./InputPin.scss";

interface InputPinProps extends BaseStyle {
  onInputChange?: any;
}

export const InputPin = React.forwardRef<
  HTMLInputElement,
  InputPinProps & HTMLAttributes<HTMLInputElement>
>(({ onInputChange, style, ...rest }, ref) => {
  return (
    <label className="input-pin-container" style={style}>
      <div className="input-pin-container__content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "200px",
          }}
        >
          <input
            id="file"
            name="file"
            type={"file"}
            ref={ref}
            onInput={onInputChange}
            {...rest}
          />
          <BsFillArrowUpCircleFill
            size={32}
            fill={darkGray}
            style={{ marginBottom: "30px" }}
          />
          <div
            className="input-pin-container__text"
            data-testid="input-pin-text"
          >
            Перетащите изображение или нажмите кнопку для загрузки
          </div>
        </div>
        <div className="input-pin-container__tip" data-testid="input-pin-tip">
          Совет: используйте файлы высокого качества в формате .jpg (размером
          меньше 20 МБ).
        </div>
      </div>
    </label>
  );
});
