import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { getToken } from "../../middleware/token";

import { UsageService } from "./usage.service";


const getMyUsage = catchAsync(
  async (req: Request, res: Response) => {

    const token = await getToken(req);

    const result = await UsageService.getMyUsage(token);


    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Usage fetched successfully!",
      data: result,
    });

  }
);


export const UsageController = {
  getMyUsage,
};