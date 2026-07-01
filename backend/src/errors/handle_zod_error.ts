import { ZodError, ZodIssue } from "zod";
import { IGenericErrorMessage } from "../interfaces/error";

const handleZodError = (err: ZodError) => {
  const statusCode = 400;
  const errors: IGenericErrorMessage[] = err.issues.map(
    (issue: ZodIssue): IGenericErrorMessage => {
      return {
        path: issue.path.length > 0 ? issue.path[issue.path.length - 1] : "",
        message: issue.message,
      };
    }
  );

  return {
    statusCode,
    message: "Zod Error",
    errorMessages: errors,
  };
};
export default handleZodError;
