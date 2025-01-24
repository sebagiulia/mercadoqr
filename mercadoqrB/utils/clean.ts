export function transformToDashCase(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '-');
}

export function transformToSpaceCase(str: string): string {
    return str.replace(/-/g, ' ');
}