
module.exports = {
  Errors: {
    ENTITY_NOT_FOUND: 'entity not found',
    INVALID_PAYLOAD: 'invalid payload',
  },
  sanitizeErrorMessage: function (message) {
    if (Object.values(this.Errors).includes(message)) {
      return message;
    } else {
      return 'an unknown error has occurred';
    }
  },
  mapErrorDetails: function (details) {
    return details.map((item) => ({
      message: item.message,
      path: item.path,
      type: item.type,
    }));
  },
};
