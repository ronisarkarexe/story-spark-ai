import mongoose from "mongoose";
import { IGenericErrorMessage } from "../interfaces/error";

const handleCastError = (err: mongoose.Error.CastError) => {
  const statusCode = 400;
  const errors: IGenericErrorMessage[] = [
    {
      path: err.path,
      message: `Invalid value for ${err.path}: "${err.value}" is not a valid ID`,
    },
  ];
  return {
    statusCode,
    message: `Cast Error: value '${err.value}' for path '${err.path}' could not be cast to type '${err.kind}'.`,
    errorMessages: errors,
  };
};
export default handleCastError;
