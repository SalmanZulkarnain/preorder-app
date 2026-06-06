interface MidtransSnapCallbacks {
    onSuccess?: () => void;
    onPending?: () => void;
    onError?: () => void;
    onClose?: () => void;
}

interface Window {
    snap?: {
        pay: (token: string, callbacks?: MidtransSnapCallbacks) => void;
    };
}
