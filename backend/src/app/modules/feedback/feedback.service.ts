import { Feedback } from "./feedback.model";
import { IFeedback } from "./feedback.interface";
import { sendContactEmail } from "../../../utils/email.util";

const submitFeedback = async (payload: IFeedback) => {
  const doc = await Feedback.create(payload);

  // Attempt to notify via email (non-blocking if email config missing)
  try {
    await sendContactEmail({
      fullname: payload.fullname || "Anonymous",
      email: payload.email || "no-reply@storyspark.ai",
      subject: `[Feedback] ${payload.type} - ${payload.subject}`,
      message: payload.message,
    });
  } catch (err) {
    // swallow email errors to avoid breaking feedback flow
    console.warn("Failed to send feedback email: ", err);
  }

  return doc;
};

export const FeedbackService = {
  submitFeedback,
};
