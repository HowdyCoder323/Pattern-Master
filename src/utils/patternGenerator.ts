
interface Pattern {
  sequence: number[];
  answer: number;
  rule: string;
}

const patternTypes = [
  'arithmetic',
  'geometric',
  'fibonacci',
  'squares',
  'cubes',
  'triangular',
  'primes',
  'alternating'
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
        rule: `Add ${diff}`
      };
    }
    
    case 'geometric': {
      const start = Math.floor(Math.random() * 3) + 2;
      const ratio = Math.floor(Math.random() * 3) + 2;
      const sequence = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio];
      return {
        sequence,
        answer: start * Math.pow(ratio, 4),
        rule: `Multiply by ${ratio}`
      };
    }
    
    case 'fibonacci': {
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 3) + 1;
      const sequence = [a, b, a + b, a + 2*b, 2*a + 3*b];
      return {
        sequence,
        answer: 3*a + 5*b,
        rule: "Fibonacci-like sequence"
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
    
    case 'primes': {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
      const startIndex = Math.floor(Math.random() * (primes.length - 5));
      const sequence = primes.slice(startIndex, startIndex + 4);
      return {
        sequence,
        answer: primes[startIndex + 4],
        rule: "Prime numbers"
      };
    }
    
    case 'alternating': {
      const base = Math.floor(Math.random() * 5) + 2;
      const add = Math.floor(Math.random() * 3) + 1;
      const sub = Math.floor(Math.random() * 2) + 1;
      const sequence = [base, base + add, base + add - sub, base + add - sub + add];
      return {
        sequence,
        answer: base + add - sub + add - sub,
        rule: `Add ${add}, subtract ${sub} alternating`
      };
    }
    
    default:
      return generatePattern(); // Fallback
  }
};

export const generatePatterns = (count: number): Pattern[] => {
  const patterns: Pattern[] = [];
  for (let i = 0; i < count; i++) {
    patterns.push(generatePattern());
  }
  return patterns;
};
