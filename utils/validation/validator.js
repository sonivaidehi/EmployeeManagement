/**
 * @description : validate request body parameter with joi.
 * @param {Object} payload : body from request.
 * @param {Object} schemaKeys : model wise schema keys. ex. user validation.
 * @returns : returns validation with message {isValid, message}
 */
 exports.validateParamsWithJoi = (payload, schemaKeys) => {
    const { error } = schemaKeys.validate(payload, {
      abortEarly: false,
      convert: false,
    });
    if (error) {
      const message = error.details.map((el) => el.message).join('\n');
      return {
        isValid: false,
        message,
      };
    }
    return { isValid: true };
  };