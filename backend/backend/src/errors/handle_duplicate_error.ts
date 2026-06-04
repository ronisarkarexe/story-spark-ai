import { IGenericErrorResponse } from "../interfaces/common";
import { IGenericErrorMessage } from "../interfaces/error";

const handleDuplicateError = (err: any): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.keys(err.keyValue).map((key) => {
    return {
      path: key,
      message: `${err.keyValue[key]} is already in use`,
    };
  });

  return {
    statusCode: 400,
    message: "Duplicate Key Error",
    errorMessages: errors,
  };
};

export default handleDuplicateError;
