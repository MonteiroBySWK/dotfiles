// A ideia é agrupar os items e as meta info de forma semantica
type DataResponse<T> = {
  items: T;
  meta?: Record<any, any>;
};

export function successResponse<T>(message: string, data: DataResponse<T>) {
  return { success: true, message, data };
}

export function errorResponse(message: string, error?: string) {
  return { success: false, message, error };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
