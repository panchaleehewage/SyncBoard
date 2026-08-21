import AppError from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  if (!schema || typeof schema.safeParse !== 'function') {
    return next(new AppError('Server Error: Invalid Zod schema provided to validator', 500));
  }

  const result = schema.safeParse(req.body);

  if (result.success) {
    req.body = result.data;
    next(); 
  } else {
    const errorMessages = result.error?.issues
      ?.map(err => `${err.path.join('.') || 'field'}: ${err.message}`)
      .join(', ') || 'Invalid input data provided.';
      
    next(new AppError(`Validation failed - ${errorMessages}`, 400));
  }
};