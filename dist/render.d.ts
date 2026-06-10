export type RenderOptions = {
    theme: "light" | "dark";
};
export type RenderResult = {
    contentHtml: string;
    title: string;
};
export declare function renderMarkdown(mdText: string, opts: RenderOptions): Promise<RenderResult>;
