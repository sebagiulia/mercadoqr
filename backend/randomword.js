export function generarPalabraAleatoria(exclusiones, length) {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let palabraAleatoria = '';
  
    do {
      // Genera la palabra aleatoria
      for (let i = 0; i < length; i++) {
        const indiceAleatorio = Math.floor(Math.random() * letras.length);
        palabraAleatoria += letras.charAt(indiceAleatorio);
      }
    } while (exclusiones.includes(palabraAleatoria));
  
    return palabraAleatoria;
  }