package main

import (
	"encoding/json"
	"net/http"

	"github.com/sarchlab/akita/v4/tracing"
)

type MessageTableEntry = tracing.MessageTableEntry

type TopologyPortEntry = tracing.TopologyPortEntry

type PortConnectionEntry = tracing.PortConnectionEntry

func httpMessageBySrcDst(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	source := r.URL.Query().Get("source")
	destination := r.URL.Query().Get("destination")

	// Prepare the SQL query
	query := "SELECT id, source, destination, enqueue_time, transmit_time, receive_time, dequeue_time FROM message_trace"
	var args []interface{}
	if source != "" && destination != "" {
		query += " WHERE source = ? AND destination = ?"
		args = append(args, source, destination)
	} else if source != "" {
		query += " WHERE source = ?"
		args = append(args, source)
	} else if destination != "" {
		query += " WHERE destination = ?"
		args = append(args, destination)
	}

	// Execute the query
	rows, err := db.Query(query, args...)
	if err != nil {
		http.Error(w, "Failed to query database", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Parse the results
	var results []MessageTableEntry
	for rows.Next() {
		var entry MessageTableEntry
		if err := rows.Scan(&entry.ID, &entry.Source, &entry.Destination, &entry.EnqueueTime, &entry.TransmitTime, &entry.ReceiveTime, &entry.DequeueTime); err != nil {
			http.Error(w, "Failed to parse database results", http.StatusInternalServerError)
			return
		}
		results = append(results, entry)
	}

	// Check for errors from iteration
	if err := rows.Err(); err != nil {
		http.Error(w, "Error iterating over results", http.StatusInternalServerError)
		return
	}

	// Convert results to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(results); err != nil {
		http.Error(w, "Failed to encode results to JSON", http.StatusInternalServerError)
		return
	}
}

func httpMessageByID(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	id := r.URL.Query().Get("id")

	// Prepare the SQL query
	query := "SELECT id, source, destination, enqueue_time, transmit_time, receive_time, dequeue_time FROM message_trace"
	var args []interface{}
	if id != "" {
		query += " WHERE id = ?"
		args = append(args, id)
	}

	// Execute the query
	rows, err := db.Query(query, args...)
	if err != nil {
		http.Error(w, "Failed to query database", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Parse the results
	var results []MessageTableEntry
	for rows.Next() {
		var entry MessageTableEntry
		if err := rows.Scan(&entry.ID, &entry.Source, &entry.Destination, &entry.EnqueueTime, &entry.TransmitTime, &entry.ReceiveTime, &entry.DequeueTime); err != nil {
			http.Error(w, "Failed to parse database results", http.StatusInternalServerError)
			return
		}
		results = append(results, entry)
	}

	// Check for errors from iteration
	if err := rows.Err(); err != nil {
		http.Error(w, "Error iterating over results", http.StatusInternalServerError)
		return
	}

	// Convert results to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(results); err != nil {
		http.Error(w, "Failed to encode results to JSON", http.StatusInternalServerError)
		return
	}
}

func httpPortConnectionAllRecords(w http.ResponseWriter, r *http.Request) {
	// Prepare the SQL query
	query := "SELECT SourcePort, DestinationPort FROM ports_connection"

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, "Failed to query database", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Parse the results
	var results []PortConnectionEntry
	for rows.Next() {
		var entry PortConnectionEntry
		if err := rows.Scan(&entry.SourcePort, &entry.DestinationPort); err != nil {
			http.Error(w, "Failed to parse database results", http.StatusInternalServerError)
			return
		}
		results = append(results, entry)
	}

	// Check for errors from iteration
	if err := rows.Err(); err != nil {
		http.Error(w, "Error iterating over results", http.StatusInternalServerError)
		return
	}

	// Convert results to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(results); err != nil {
		http.Error(w, "Failed to encode results to JSON", http.StatusInternalServerError)
		return
	}
}

func httpTopologyPorts(w http.ResponseWriter, r *http.Request) {
	// Prepare the SQL query
	query := "SELECT port, component FROM topology_ports"

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, "Failed to query database", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Parse the results
	var results []TopologyPortEntry
	for rows.Next() {
		var entry TopologyPortEntry
		if err := rows.Scan(&entry.Port, &entry.Component); err != nil {
			http.Error(w, "Failed to parse database results", http.StatusInternalServerError)
			return
		}
		results = append(results, entry)
	}

	// Check for errors from iteration
	if err := rows.Err(); err != nil {
		http.Error(w, "Error iterating over results", http.StatusInternalServerError)
		return
	}

	// Convert results to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(results); err != nil {
		http.Error(w, "Failed to encode results to JSON", http.StatusInternalServerError)
		return
	}
}
