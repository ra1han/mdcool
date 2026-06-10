export type TemplateOptions = {
    title: string;
    contentHtml: string;
    theme: "light" | "dark";
};
export declare function buildHtml(opts: TemplateOptions): string;
