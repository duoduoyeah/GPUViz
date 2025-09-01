import type {Message, MessageEntry} from "../../types"







export class MessageBuilder {

    public readMessagesFromSQLite(){
    }

    public buildFromsqlite(rawMsgs: MessageEntry[]): Map<string, Message> {
            const msgMap = new Map<string, Message>();
            for (const entry of rawMsgs) {
                const msg: Message = {
                    id: entry.ID,
                    source: entry.Source,
                    target: entry.Destination,
                    EnqueueTime: entry.EnqueueTime,
                    TransmitTime: entry.TransmitTime,
                    ReceiveTime: entry.ReceiveTime,
                    DequeueTime: entry.DequeueTime
                };
                msgMap.set(msg.id, msg);
            }
            return msgMap;
    }
}