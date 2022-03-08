/// <reference types="vite/client" />
declare module '*.wgsl' {
    const content: string;
    export default content;
}