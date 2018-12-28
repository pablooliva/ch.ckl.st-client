export function diff(
  text1: string,
  text2: string,
  cursorPos?: number | fdiff.CursorInfo
): fdiff.Diff[];

export namespace fdiff {
  type Diff = [-1 | 0 | 1, string];

  const DELETE: -1;
  const INSERT: 1;
  const EQUAL: 0;

  interface CursorInfo {
    oldRange: { index: number; length: number };
    newRange: { index: number; length: number };
  }
}
