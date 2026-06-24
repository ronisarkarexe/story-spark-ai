import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import { detectPlotHoles } from "./plot_hole.service";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";

const detect = catchAsync(async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const result = await detectPlotHoles(title || "Untitled", content);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plot hole analysis complete.",
    data: result,
  });
});

export const PlotHoleController = {
  detect,
};
