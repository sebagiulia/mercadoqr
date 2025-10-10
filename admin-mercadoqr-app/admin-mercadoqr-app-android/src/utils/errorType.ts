export default interface ErrorType<T> {
    success: boolean;
    error?: {
        code: string;
        message: string;
        details: string;
    }
    data?: T;
    message?: string;
}