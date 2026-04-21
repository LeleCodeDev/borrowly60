type ValidationError = {
  field: string;
  tag: string;
  param?: string;
};

export const getValidationErrors = (
  errors: ValidationError[],
): Record<string, string> => {
  const result: Record<string, string> = {};

  errors.forEach((e) => {
    const field = e.field;

    switch (e.tag) {
      case "required":
        result[field] = `${field} is required`;
        break;

      case "email":
        result[field] = `${field} must be a valid email`;
        break;

      case "min":
        result[field] = `${field} must contain at least ${e.param} characters`;
        break;

      case "max":
        result[field] = `${field} must contain at most ${e.param} characters`;
        break;

      case "gt":
        result[field] = `${field} must be greater than ${e.param}`;
        break;

      case "gte":
        result[field] = `${field} must be greater than or equal ${e.param}`;
        break;

      case "lt":
        result[field] = `${field} must be less than ${e.param}`;
        break;

      case "lte":
        result[field] = `${field} must be less than or equal ${e.param}`;
        break;

      case "oneof": {
        const values = (e.param || "").split(" ").join(", ");
        result[field] = `${field} must be one of these values: ${values}`;
        break;
      }

      default:
        result[field] = `${field} is invalid`;
    }
  });

  return result;
};
