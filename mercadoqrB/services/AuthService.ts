export default interface AuthService {
    loginAdmin(name: string, password: string): Promise<{ token: string }>;
    loginScanner(name: string, password: string): Promise<{ token: string }>;
}