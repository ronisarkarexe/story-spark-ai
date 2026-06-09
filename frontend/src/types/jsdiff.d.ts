declare module 'jsdiff' {
  export interface Change {
    value: string;
    added?: boolean;
    removed?: boolean;
  }

  export function diffChars(
    oldStr: string,
    newStr: string,
    options?: { ignoreWhitespace?: boolean }
  ): Change[];

  export function diffWords(
    oldStr: string,
    newStr: string,
    options?: Record<string, unknown>
  ): Change[];

  export function diffLines(
    oldStr: string,
    newStr: string,
    options?: Record<string, unknown>
  ): Change[];

  export function diffSentences(
    oldStr: string,
    newStr: string,
    options?: Record<string, unknown>
  ): Change[];

  export function diffCss(
    oldStr: string,
    newStr: string,
    options?: Record<string, unknown>
  ): Change[];

  export function diffJson(
    oldObj: object | string | number | boolean | null,
    newObj: object | string | number | boolean | null,
    options?: Record<string, unknown>
  ): Change[];

  export function diffArrays<T = unknown>(
    oldArr: T[],
    newArr: T[],
    options?: Record<string, unknown>
  ): Change[];

  export function createTwoFilesPatch(
    oldFileName: string,
    newFileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: Record<string, unknown>
  ): string;

  export function createPatch(
    fileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: Record<string, unknown>
  ): string;

  export function applyPatch(
    source: string,
    uniDiff: string,
    options?: Record<string, unknown>
  ): string | false;

  export function applyPatches(
    uniDiff: string | string[],
    options?: Record<string, unknown>
  ): string;

  export function parsePatch(
    uniDiff: string | string[]
  ): object[];

  export function convertChangesToDMP(changes: Change[]): unknown[];

  export function convertChangesToXML(changes: Change[]): string;

  export function canonicalize(obj: object | string | number | boolean | null): object | string | number | boolean | null;
}