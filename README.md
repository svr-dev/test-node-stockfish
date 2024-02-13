# test-node-stockfish
Assessment test for "Backend Developer" vacancy.

The program performs a demo chess game between two chess engine instances, writing moves in database during the game and executing table dump and text log of the game in the end.

It is expected that you have Node.js, Node package manager (npm) and PostgreSQL services installed and running on your machine.

To run this locally:

- clone the project
- run "npm install" in the project directory
- create '.env' file in the project root directory
- fill it with the following properties and run 'npm run start:dev':

POSTGRES_DB=*YOUR DATABASE NAME*

POSTGRES_USER=*YOUR DATABASE USERNAME*

POSTGRES_PASSWORD=*YOUR DATABASE PASSWORD*

POSTGRES_PORT=5432