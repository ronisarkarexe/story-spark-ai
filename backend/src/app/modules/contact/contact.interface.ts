export type IContactRequest = {
  fullname?: string;
  email?: string;
  feedbackType: "bug-report" | "feature-request" | "general-feedback";
  subject: string;
  message: string;
};
