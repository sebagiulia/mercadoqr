export default function generateUniqueCode(existingCodes: string[]): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const codeLength = 6;
  
    function generateRandomCode(): string {
      let code = "";
      for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset[randomIndex];
      }
      return code;
    }
  
    let newCode: string;
    do {
      newCode = generateRandomCode();
    } while (existingCodes.includes(newCode));
  
    return newCode;
  }