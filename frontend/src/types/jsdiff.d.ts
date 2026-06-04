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
    options?: any
  ): Change[];

  export function diffLines(
    oldStr: string,
    newStr: string,
    options?: any
  ): Change[];

  export function diffSentences(
    oldStr: string,
    newStr: string,
    options?: any
  ): Change[];

  export function diffCss(
    oldStr: string,
    newStr: string,
    options?: any
  ): Change[];

  export function diffJson(
    oldStr: any,
    newStr: any,
    options?: any
  ): Change[];

  export function diffArrays(
    oldArr: any[],
    newArr: any[],
    options?: any
  ): Change[];

  export function createTwoFilesPatch(
    oldFileName: string,
    newFileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: any
  ): string;

  export function createPatch(
    fileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: any
  ): string;

  export function applyPatch(
    source: string,
    uniDiff: string,
    options?: any
  ): string | false;

  export function applyPatches(
    uniDiff: string | string[],
    options?: any
  ): string;

  export function parsePatch(
    uniDiff: string | string[]
  ): any[];

  export function convertChangesToDMP(changes: Change[]): any;

  export function convertChangesToXML(changes: Change[]): string;

  export function canonicalize(obj: any): any;
}
