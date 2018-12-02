import React from "react";
import { Button } from "reactstrap";
import "./LoaderButton.css";
import { TiSpiral } from 'react-icons/ti';

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <TiSpiral size="1.8em" className="spinning" />}
    {!isLoading ? text : loadingText}
  </Button>;