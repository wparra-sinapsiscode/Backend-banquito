const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const err = new Error('Validation Error');
      err.isJoi = true;
      err.details = error.details;
      return next(err);
    }

    // Reemplazar el valor original con el valor validado y sanitizado
    req[property] = value;
    next();
  };
};

// Middleware para validar parámetros de query
const validateQuery = (schema) => validate(schema, 'query');

// Middleware para validar parámetros de ruta
const validateParams = (schema) => validate(schema, 'params');

// Middleware para validar body
const validateBody = (schema) => validate(schema, 'body');

module.exports = {
  validate,
  validateQuery,
  validateParams,
  validateBody
};