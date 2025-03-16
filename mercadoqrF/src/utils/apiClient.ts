
export const apiClient = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  
    try {
      const response = await fetch(`${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error en la llamada a ${url}:`, error);
      throw error;
    }
  };
  