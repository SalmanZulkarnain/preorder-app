export { };

declare global {
    interface Window {
        snap?: {
            pay: (token: string, callbacks?: SnapPayOptions) => void;
        };
    }
}

interface SnapPayOptions {
    onSuccess?: (result: unknown) => void;
    onPending?: (result: unknown) => void;
    onError?: (result: unknown) => void;
    onClose?: () => void;
}