import { NextFunction, Request, Response } from "express";

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong. Please try again later'
  };
  console.log(err);
  if (Array.isArray(err)) { customError.message = err.map(item => item.message).join(', '); customError.statusCode = 400; }
  if (err.code && err.code === 11000) { customError.message = 'User already exists'; customError.statusCode = 409; }
  return res.status(customError.statusCode).json({ message: customError.message });
};

export default errorHandlerMiddleware;