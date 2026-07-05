import { createServer } from "node:http";

import { handleRequest } from "./http.js";

const defaultPort = 4000;
const host = process.env.HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? String(defaultPort), 10);
const hostLabel = host;
const portLabel = String(port);

const server = createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`TasteApp API listening on http://${hostLabel}:${portLabel}`);
});
