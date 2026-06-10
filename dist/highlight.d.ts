type HighlightFn = (code: string, lang: string) => string;
export declare function createHighlighter(theme: "light" | "dark"): Promise<HighlightFn>;
export {};
