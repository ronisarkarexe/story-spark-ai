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
    message: `Invalid ${err.path}: "${err.value}" could not be cast to a valid ObjectId`,
    errorMessages: errors,
  };
};
export default handleCastError;
