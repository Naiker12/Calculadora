export function parseFunction(
  fnString: string
): { func: ((x: number) => number) | null; error: string | null } {
  try {
    // Replace common math notations with JavaScript equivalents
    let sanitizedString = fnString.toLowerCase();
    sanitizedString = sanitizedString.replace(/\^/g, '**');
    sanitizedString = sanitizedString.replace(/sin/g, 'Math.sin');
    sanitizedString = sanitizedString.replace(/cos/g, 'Math.cos');
    sanitizedString = sanitizedString.replace(/tan/g, 'Math.tan');
    sanitizedString = sanitizedString.replace(/sqrt/g, 'Math.sqrt');
    sanitizedString = sanitizedString.replace(/exp/g, 'Math.exp');
    sanitizedString = sanitizedString.replace(/ln/g, 'Math.log');
    sanitizedString = sanitizedString.replace(/log10/g, 'Math.log10');
    sanitizedString = sanitizedString.replace(/pi/g, 'Math.PI');
    sanitizedString = sanitizedString.replace(/e/g, 'Math.E');

    const func = new Function('x', `return ${sanitizedString};`);
    
    // Test the function with a value to catch runtime errors
    func(1);

    return { func: func as (x: number) => number, error: null };
  } catch (e: any) {
    return {
      func: null,
      error: `Invalid function: ${e.message}. Use standard JS math syntax (e.g., 'x**3 - 2*x + 1').`,
    };
  }
}
