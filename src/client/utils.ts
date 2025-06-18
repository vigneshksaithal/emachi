export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  let i = shuffled.length;

  while (i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}