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


declare module 'ioredis' {
  const Redis: any;
  export default Redis;
}

declare module 'razorpay' {
  const Razorpay: any;
  export default Razorpay;
}

declare module 'compromise' {
  const compromise: any;
  export default compromise;
}

declare module 'tiktoken' {
  export function get_encoding(encoding: string): {
    encode(text: string): Uint32Array;
    free(): void;
  };
}

declare module '@anthropic-ai/sdk' {
  class Anthropic {
    constructor(options: { apiKey: string });
    messages: {
      create(body: any, options?: any): Promise<any>;
    };
  }
  export default Anthropic;
}