

## Current

1. the ts side
-> rewrite dataloader
-> rewrite sqliteComponentBuilder

## TODO
1. test if the server start successfully
2. test if api could be call successfully

## Requirement for server
The server is written in go language, its a server that read the sqlite
file and prepare for ts project to read from it.(No written, just read)

The server use a function to get the sqlite file in the local disk
The server will be start with a flag, which is the path of the sqlite file

1. start it use flag like go run main.go [sqlite file path]

2. give api that the ts project could call it

### logic part

* configuration 
Handle all configuration inputs before the server starts.

* Abstract SQLite access into a reusable component. This part separates data access from HTTP handling.
connectToDB()         // Open DB connection
initDB()              // Optional: prepare tables / indexes
queryTraces()         // Returns trace data
queryComponents()     // Returns component metadata

* API Layer (Necessary)
Each function corresponds to a domain concept you want to expose.
httpTrace()            // GET /api/trace
httpComponentNames()   // GET /api/compnames
httpComponentInfo()    // GET /api/compinfo

## Requirement for ts side

1. call the api to init the topology and message data

