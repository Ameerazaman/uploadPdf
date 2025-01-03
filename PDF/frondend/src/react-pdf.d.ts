declare module 'react-pdf' {
    export const pdfjs: {

        GlobalWorkerOptions: {
            workerSrc: string;
        };
    };

    export { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
}

