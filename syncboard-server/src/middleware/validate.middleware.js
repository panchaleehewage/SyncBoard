import AppError from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  // 1. A safety check just in case the schema didn't import correctly
  if (!schema || typeof schema.safeParse !== 'function') {
    return next(new AppError('Server Error: Invalid Zod schema provided to validator', 500));
  }

  const result = schema.safeParse(req.body);

  if (result.success) {
    req.body = result.data;
    next(); 
  } else {
    // 2. Safely extract the issues. 
    // We use ?. (optional chaining) so if a property is missing, it won't crash!
    const errorMessages = result.error?.issues
      ?.map(err => `${err.path.join('.') || 'field'}: ${err.message}`)
      .join(', ') || 'Invalid input data provided.';
      
    next(new AppError(`Validation failed - ${errorMessages}`, 400));
  }
};