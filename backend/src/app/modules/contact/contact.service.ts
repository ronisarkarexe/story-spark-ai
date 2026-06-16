import { sendContactEmail } from "../../../utils/email.util";
import { IContactRequest } from "./contact.interface";

const submitContactForm = async (payload: IContactRequest) => {
  await sendContactEmail(payload);
  return {
    message: "Your feedback has been sent successfully. We will get back to you soon.",
  };
};

export const ContactService = {
  submitContactForm,
};
