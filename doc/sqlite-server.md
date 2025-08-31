

## Implement

* when npm run our ts project, the go sqlite server will run in the background 

1. when start the ts project, the go server run
2. when the ts web give a list of sqlite the user could choose


* the go server when start do not has any sqlite file path. the path is from: web -> path -> sqlite server(read sqlite file from the path)

## Requirement for server

1. start it use flag like go run main.go [sqlite file path]

2. give api that the ts project could call it

## Requirement for ts side

1. call the api to init the topology and message data