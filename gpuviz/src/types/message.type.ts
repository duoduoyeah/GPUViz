
export interface Message {
    id: string;
    source: string;
    target: string;
    EnqueueTime: number;
    TransmitTime: number;
    ReceiveTime: number;
    DequeueTime: number;
}