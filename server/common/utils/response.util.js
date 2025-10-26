import { HTTP_STATUS } from '../../core/constants/api.constants.js';

export class ResponseUtil {
  static success(res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static error(res, message = 'Error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST, errors);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN);
  }

  static conflict(res, message = 'Resource conflict') {
    return this.error(res, message, HTTP_STATUS.CONFLICT);
  }

  static serverError(res, message = 'Internal server error') {
    return this.error(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export default ResponseUtil;
