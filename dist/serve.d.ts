export type ServeOptions = {
    theme: "light" | "dark";
    port: number;
};
export declare function startServer(filePath: string, opts: ServeOptions): Promise<void>;
