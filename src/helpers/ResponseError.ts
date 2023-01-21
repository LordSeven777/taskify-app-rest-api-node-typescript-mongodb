// Response error
class ResponseError extends Error {
  // Error status code
  status: number;

  // Error payload
  payload: any;

  constructor(status: number, message: string, payload?: any) {
    super();
    this.status = status;
    this.message = message;
    payload && (this.payload = payload);
  }
}

export default ResponseError;