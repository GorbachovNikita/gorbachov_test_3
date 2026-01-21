import React from "react";
import "./ErrorsBlock.css";

const ErrorsBlock = (props) => {
  return (
    <div className={`errors-block`} style={{ display: props?.display }}>
      <div className="errors-list">
        {Array?.isArray(props?.errors) &&
          props?.errors?.map((element, index) => {
            return <p key={index}>&#8226; {element}</p>;
          })}
      </div>
      <div className="closed-errors-block">
        <p
          onClick={() => {
            props?.setDisplay("none");
          }}
        >
          X
        </p>
      </div>
    </div>
  );
};

export default ErrorsBlock;
