export declare function encode(prefix: any, words: any, LIMIT?: any): any;
export declare function decode(str: string, prefix: string, LIMIT?: number): {
    prefix: string;
    words: number[];
};
export declare function toWords(bytes: any): number[];
export declare function fromWords(words: any): number[];
