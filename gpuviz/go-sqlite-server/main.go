package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"regexp"
	"syscall"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var (
	sqlitePath = flag.String("db", "", "path to sqlite database file")
	addr       = flag.String("addr", ":8080", "http listen address")
	db         *sql.DB

	localhostRegex = regexp.MustCompile(`^https?://localhost(:\d+)?$`)
)

// CORS middleware
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Check if origin is localhost with any port
		if origin != "" && localhostRegex.MatchString(origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
		}

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
			w.Header().Set("Access-Control-Max-Age", "3600")
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// Call the actual handler
		next(w, r)
	}
}

func openSQLiteFile(path string) (*sql.DB, error) {
	return sql.Open("sqlite3", "file:"+path+"?mode=ro&cache=shared")
}

func initDB(path string) (*sql.DB, error) {
	if path == "" {
		return nil, fmt.Errorf("missing required -db flag")
	}

	db, err := openSQLiteFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite db: %v", err)
	}

	return db, nil
}

func startServer(ctx context.Context, addr string) error {
	srv := &http.Server{
		Addr:    addr,
		Handler: nil,
	}

	http.HandleFunc("/api/message", enableCORS(httpMessageByID))
	http.HandleFunc("/api/message_by_src_dst", enableCORS(httpMessageBySrcDst))
	http.HandleFunc("/api/ports_connection", enableCORS(httpPortConnectionAllRecords))
	http.HandleFunc("/api/topology_ports", enableCORS(httpTopologyPorts))

	// Start server in a goroutine
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	log.Printf("Server started on %s", addr)

	// Wait for context cancellation or termination signal
	<-ctx.Done()

	log.Println("Shutting down server...")

	// Gracefully shutdown the server
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return srv.Shutdown(shutdownCtx)
}

func main() {
	flag.Parse()

	var err error
	db, err = initDB(*sqlitePath)
	if err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}
	defer db.Close()

	// Setup signal handling for graceful shutdown
	signalCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := startServer(signalCtx, *addr); err != nil {
		log.Fatalf("Server error: %v", err)
	}

	log.Println("Server exited gracefully")
}
