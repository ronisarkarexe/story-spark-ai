declare module 'helmet' {
  import { RequestHandler } from 'express';
  const helmet: () => RequestHandler;
  export default helmet;
}




declare module 'ioredis' {
  const Redis: any;
  export default Redis;
}

declare module 'razorpay' {
  const Razorpay: any;
  export default Razorpay;
}