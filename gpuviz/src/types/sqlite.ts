

export interface TopologyPortEntry {
	port: string; // corresponds to json:"port" akita_data:"unique"
	component: string; // corresponds to json:"component" akita_data:"index"
}

export interface PortConnectionEntry {
	from_port: string; // corresponds to json:"from_port" akita_data:"index"
	to_port: string;   // corresponds to json:"to_port" akita_data:"index"
}
