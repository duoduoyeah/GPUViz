import type {Message, MessageEntry} from "../../types"
import Database from 'better-sqlite3';






export class MessageBuilder {

    public readMessagesFromSQLite(sqliteFilePath: string): MessageEntry[] {
    const db = new Database(sqliteFilePath);
    const rows = db.prepare('SELECT ID, Source, Destination, EnqueueTime, TransmitTime, ReceiveTime, DequeueTime FROM messages').all();
    db.close();
    return rows as MessageEntry[];
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