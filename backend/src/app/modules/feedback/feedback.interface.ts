export interface IFeedback {
  fullname?: string;
  email?: string;
  type: string; // 'bug' | 'feature' | 'general'
  subject: string;
  message: string;
}

export default IFeedback;
