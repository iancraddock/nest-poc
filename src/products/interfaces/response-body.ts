export type ResponseError = {
  error: {
    status: number;
    message: string;
  };
};

export type ResponseSuccess = {
  status: number;
  orderId: string;
  error?: ResponseError['error'];
};

type ResponseBody = ResponseError | ResponseSuccess;

export default ResponseBody;
