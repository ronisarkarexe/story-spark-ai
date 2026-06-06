declare module 'helmet' {
  import { RequestHandler } from 'express';
  const helmet: () => RequestHandler;
  export default helmet;
}

declare module 'express-rate-limit' {
  import { RequestHandler } from 'express';
  interface Options {
    windowMs?: number;
    max?: number;
    message?: string;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
  }
  const rateLimit: (options?: Options) => RequestHandler;
  export default rateLimit;
}

declare module 'bcryptjs' {
  const bcrypt: any;
  export default bcrypt;
}

declare module 'ioredis' {
  const Redis: any;
  export default Redis;
}

declare module 'razorpay' {
  const Razorpay: any;
  export default Razorpay;
}