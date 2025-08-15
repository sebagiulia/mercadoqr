// src/services/authService.ts



export async function login(username: string, password: string): Promise<boolean> {
    // Aquí podrías llamar a tu API real
    // Simulación: usuario "admin", pass "1234"
    await new Promise((r) => setTimeout(r, 500)); // simulamos delay
    return username === "admin" && password === "1234";
  }
  