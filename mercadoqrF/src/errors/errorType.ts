export default interface ErrorType {
    success: boolean;
    error?: {
        code: string;
        message: string;
        details: string;
    }
    data?: any;
    message?: string;
}