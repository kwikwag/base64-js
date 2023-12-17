export declare function byteLength(b64: string): number;
export declare function toByteArray(b64: string): Uint8Array;
export declare interface FromByteArrayOptions {
    variant?: "base64" | "base64url"
    pad?: "yes" | "no"
}
export declare function fromByteArray(uint8: Uint8Array, opts: FromByteArrayOptions): string;

