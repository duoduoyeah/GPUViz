// JSON structure interfaces
export interface JsonPort {
    name: string;
    incomingPort: string[] | null;
    outgoingPort: string[] | null;
}

export interface JsonComponent {
    name: string;
    ports: JsonPort[];
}

export interface JsonData {
    components: JsonComponent[];
}
