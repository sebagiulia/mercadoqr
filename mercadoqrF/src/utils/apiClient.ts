import ErrorType from "errors/errorType";

export const apiClient = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  
    try {
      const response = await fetch(`${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
          throw {
            success: false,
            error: {code:response.status.toString(),
                    message: errorData?.error?.message || 'Error desconocido',
                    details: errorData?.error?.details || null},
          } as ErrorType;
        };

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error en la llamada a ${url}:`, error);
      throw error;
    }
  };
  