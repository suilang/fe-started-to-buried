declare module '*.html' {
    const rawHtmlFile: string;
    export = rawHtmlFile;
}

declare module '*.bmp' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    const src: string;
    export default src;
}

declare namespace globalThis {
    interface Window {
        show_log_view: () => void;
        ChatAssistant: any;
        getUserInfo: () => Promise<any>;
        INIT_TIME_MS: number;
        log?: any;
        INIT_MODE: string;
    }
}
