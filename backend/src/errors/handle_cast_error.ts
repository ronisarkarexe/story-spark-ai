import mongoose from "mongoose";
import { IGenericErrorMessage } from "../interfaces/error";

const handleCastError = (err: mongoose.Error.CastError) => {
  const statusCode = 400;
  const errors: IGenericErrorMessage[] = [
    {
      path: err.path,
      message: "Invalid Id",
    },
  ];
  return {
    statusCode,
    message: err.name,
    errorMessages: errors,
  };
};
export default handleCastError;
