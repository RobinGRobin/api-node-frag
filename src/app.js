import express from "express";
import config from "./config";
import routesOne from "./routes/routes";

const app = express();

// server port config
app.set('port', config.port);

//view engine config
app.set('view engine', 'ejs');

// Routes
// app.use('/', (req, res) => { console.log("server on port, ", config.port)});
app.use('/', routesOne);

export default app;