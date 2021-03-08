# ski-resort-rust

## How to run
### API
api folder contains all the api related code, to execute code you'll need to follow the steps:
1. On command prompt / terminal navigate to api folder
2. Execute `cargo run`
3. WebServer will start listening on port 8080

### UI
ui folder contains the front-end application, it is based on create-react-app and to run it follow this steps:
1. On command prompt / terminal navigate to ui folder
2. Execute `npm install`
3. Execute `npm start`
4. Development server will start on port 3000

## Entities

User
 - id: mongo objectId
 - firstName: string
 - lastName: string
 - email: string
 - favResort: string

Resort
 - id: mongo objectId
 - name: string
 - location: string

## ToDo
- [X] Research rust frameworks
- [X] Setup API first enpoint
- [X] Connect to DB
- [X] Implement resort endpoints
- [X] Implement user endpoints
- [X] Setup frontend
- [X] Link UI with API
- [X] Implement Resorts screen
- [X] Implement Users screen
- [X] Implement Thank you page
- [X] Implement Reports screen
