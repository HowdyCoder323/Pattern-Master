
interface Pattern {
  sequence: number[];
  answer: number;
  rule: string;
}

const patternTypes = [
  // Algebraic Sequences
  'arithmetic',
  'geometric', 
  'harmonic',
  'quadratic',
  'cubic',
  'polynomial',
  'fibonacci',
  'factorial',
  'double_factorial',
  
  // Logical/Rule-Based Sequences
  'alternating_sign',
  'alternating_ap_gp',
  'powers_of_ten',
  'powers_of_two',
  'square_minus_one',
  'mirror_numbers',
  'repeating_digits',
  
  // Special Number Sequences
  'triangular',
  'pentagonal',
  'centered',
  'primes',
  'composite',
  'squares',
  'cubes'
] as const;

export const generatePattern = (): Pattern => {
  const type = patternTypes[Math.floor(Math.random() * patternTypes.length)];
  
  switch (type) {
    case 'arithmetic': {
      const start = Math.floor(Math.random() * 10) + 1;
      const diff = Math.floor(Math.random() * 5) + 2;
      const sequence = [start, start + diff, start + 2*diff, start + 3*diff];
      return {
        sequence,
        answer: start + 4*diff,
        rule: `Arithmetic: +${diff}`
      };
    }
    
    case 'geometric': {
      const start = Math.floor(Math.random() * 3) + 2;
      const ratio = Math.floor(Math.random() * 3) + 2;
      const sequence = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio];
      return {
        sequence,
        answer: start * Math.pow(ratio, 4),
        rule: `Geometric: ×${ratio}`
      };
    }
    
    case 'harmonic': {
      const start = Math.floor(Math.random() * 3) + 2;
      const sequence = [1/start, 1/(start+1), 1/(start+2), 1/(start+3)];
      const roundedSeq = sequence.map(n => Math.round(n * 100) / 100);
      return {
        sequence: roundedSeq,
        answer: Math.round((1/(start+4)) * 100) / 100,
        rule: "Harmonic: 1/n sequence"
      };
    }
    
    case 'quadratic': {
      const start = Math.floor(Math.random() * 3) + 1;
      const sequence = [(start)**2, (start+1)**2, (start+2)**2, (start+3)**2];
      return {
        sequence,
        answer: (start+4)**2,
        rule: "Quadratic: n²"
      };
    }
    
    case 'cubic': {
      const start = Math.floor(Math.random() * 2) + 1;
      const sequence = [(start)**3, (start+1)**3, (start+2)**3, (start+3)**3];
      return {
        sequence,
        answer: (start+4)**3,
        rule: "Cubic: n³"
      };
    }
    
    case 'polynomial': {
      const a = Math.floor(Math.random() * 2) + 1;
      const b = Math.floor(Math.random() * 3) + 1;
      const c = Math.floor(Math.random() * 2) + 1;
      const poly = (n: number) => a*n*n + b*n + c;
      const sequence = [poly(1), poly(2), poly(3), poly(4)];
      return {
        sequence,
        answer: poly(5),
        rule: "Polynomial growth"
      };
    }
    
    case 'fibonacci': {
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 3) + 1;
      const sequence = [a, b, a + b, a + 2*b, 2*a + 3*b];
      return {
        sequence,
        answer: 3*a + 5*b,
        rule: "Fibonacci-like"
      };
    }
    
    case 'factorial': {
      const start = Math.floor(Math.random() * 2) + 1;
      const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
      const sequence = [factorial(start), factorial(start+1), factorial(start+2), factorial(start+3)];
      return {
        sequence,
        answer: factorial(start+4),
        rule: "Factorial: n!"
      };
    }
    
    case 'double_factorial': {
      const doubleFactorial = (n: number): number => {
        if (n <= 0) return 1;
        return n * doubleFactorial(n - 2);
      };
      const start = Math.floor(Math.random() * 2) + 3;
      const sequence = [doubleFactorial(start), doubleFactorial(start+2), doubleFactorial(start+4), doubleFactorial(start+6)];
      return {
        sequence,
        answer: doubleFactorial(start+8),
        rule: "Double factorial: n!!"
      };
    }
    
    case 'alternating_sign': {
      const base = Math.floor(Math.random() * 5) + 2;
      const sequence = [base, -2*base, 3*base, -4*base];
      return {
        sequence,
        answer: 5*base,
        rule: "Alternating sign"
      };
    }
    
    case 'alternating_ap_gp': {
      const start = Math.floor(Math.random() * 3) + 2;
      const sequence = [start, start*2, start*2+2, (start*2+2)*2];
      return {
        sequence,
        answer: (start*2+2)*2+2,
        rule: "×2 then +2 alternating"
      };
    }
    
    case 'powers_of_ten': {
      const start = Math.floor(Math.random() * 2);
      const sequence = [Math.pow(10, start), Math.pow(10, start+1), Math.pow(10, start+2), Math.pow(10, start+3)];
      return {
        sequence,
        answer: Math.pow(10, start+4),
        rule: "Powers of 10"
      };
    }
    
    case 'powers_of_two': {
      const start = Math.floor(Math.random() * 3) + 1;
      const sequence = [Math.pow(2, start), Math.pow(2, start+1), Math.pow(2, start+2), Math.pow(2, start+3)];
      return {
        sequence,
        answer: Math.pow(2, start+4),
        rule: "Powers of 2"
      };
    }
    
    case 'square_minus_one': {
      const start = Math.floor(Math.random() * 3) + 2;
      const sequence = [(start)**2 - 1, (start+1)**2 - 1, (start+2)**2 - 1, (start+3)**2 - 1];
      return {
        sequence,
        answer: (start+4)**2 - 1,
        rule: "n² - 1"
      };
    }
    
    case 'mirror_numbers': {
      const peak = Math.floor(Math.random() * 3) + 4;
      const sequence = [peak-3, peak-2, peak-1, peak];
      return {
        sequence,
        answer: peak-1,
        rule: "Mirror sequence"
      };
    }
    
    case 'repeating_digits': {
      const digit = Math.floor(Math.random() * 9) + 1;
      const sequence = [digit, parseInt(`${digit}${digit}`), parseInt(`${digit}${digit}${digit}`), parseInt(`${digit}${digit}${digit}${digit}`)];
      return {
        sequence,
        answer: parseInt(`${digit}${digit}${digit}${digit}${digit}`),
        rule: "Repeating digits"
      };
    }
    
    case 'triangular': {
      const start = Math.floor(Math.random() * 3) + 1;
      const triangular = (n: number) => n * (n + 1) / 2;
      const sequence = [triangular(start), triangular(start+1), triangular(start+2), triangular(start+3)];
      return {
        sequence,
        answer: triangular(start+4),
        rule: "Triangular numbers"
      };
    }
    
    case 'pentagonal': {
      const start = Math.floor(Math.random() * 3) + 1;
      const pentagonal = (n: number) => n * (3*n - 1) / 2;
      const sequence = [pentagonal(start), pentagonal(start+1), pentagonal(start+2), pentagonal(start+3)];
      return {
        sequence,
        answer: pentagonal(start+4),
        rule: "Pentagonal numbers"
      };
    }
    
    case 'centered': {
      const start = Math.floor(Math.random() * 3) + 1;
      const centered = (n: number) => 3*n*(n-1) + 1;
      const sequence = [centered(start), centered(start+1), centered(start+2), centered(start+3)];
      return {
        sequence,
        answer: centered(start+4),
        rule: "Centered hexagonal"
      };
    }
    
    case 'primes': {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      const startIndex = Math.floor(Math.random() * (primes.length - 5));
      const sequence = primes.slice(startIndex, startIndex + 4);
      return {
        sequence,
        answer: primes[startIndex + 4],
        rule: "Prime numbers"
      };
    }
    
    case 'composite': {
      const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
      const startIndex = Math.floor(Math.random() * (composites.length - 5));
      const sequence = composites.slice(startIndex, startIndex + 4);
      return {
        sequence,
        answer: composites[startIndex + 4],
        rule: "Composite numbers"
      };
    }
    
    case 'squares': {
      const start = Math.floor(Math.random() * 3) + 1;
      const sequence = [(start)**2, (start+1)**2, (start+2)**2, (start+3)**2];
      return {
        sequence,
        answer: (start+4)**2,
        rule: "Perfect squares"
      };
    }
    
    case 'cubes': {
      const start = Math.floor(Math.random() * 2) + 1;
      const sequence = [(start)**3, (start+1)**3, (start+2)**3, (start+3)**3];
      return {
        sequence,
        answer: (start+4)**3,
        rule: "Perfect cubes"
      };
    }
    
    default:
      return generatePattern();
  }
};

export const generatePatterns = (count: number): Pattern[] => {
  const patterns: Pattern[] = [];
  for (let i = 0; i < count; i++) {
    patterns.push(generatePattern());
  }
  return patterns;
};
