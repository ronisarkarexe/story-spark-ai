import { AnyZodObject, ZodEffects } from "zod";
import { NextFunction, Request, Response } from "express";

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
          cookies: req.cookies,
        });

        // Assign validated and filtered data back to Request object
        req.body = result.body;
        req.query = result.query;
        req.params = result.params;

        return next();
      } catch (error) {
        next(error);
      }
    };

export default validateRequest;
