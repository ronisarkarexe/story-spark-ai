import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { ContactService } from "./contact.service";

const submitContactForm = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.submitContactForm(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Message sent successfully",
    data: result,
  });
});

export const ContactController = {
  submitContactForm,
};
