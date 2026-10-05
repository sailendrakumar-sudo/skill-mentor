export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    req.validatedBody = parsed.data;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal validation error',
      message: err.message
    });
  }
};
