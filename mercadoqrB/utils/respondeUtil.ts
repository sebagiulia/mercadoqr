export const sendSuccess = (res:any, data:any = null, message = 'Operación exitosa', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  };
  
  export const sendError = (res:any, errorCode = 'INTERNAL_ERROR', message = 'Error interno del servidor', details = null, statusCode = 500) => {
    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details,
      },
    });
  };
  
  