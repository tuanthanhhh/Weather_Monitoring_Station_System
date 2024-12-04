require('dotenv').config();
const express =require('express');
const configViewEngine = require('./config/viewEngine');
const http = require('http');
const connection = require('./config/database');
const WebSocket = require('ws');
const { initWebSocket } = require('./controllers/webSocketController');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8081;
const hostname=process.env.HOST_NAME;
const webRouter = require('./routes/web');
const wss = new WebSocket.Server({ server });

//config req.body
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//config template engine
configViewEngine(app);

//khai bao router
app.use('/',webRouter);

initWebSocket(server);



server.listen(port,hostname,()=>{
    console.log(`connect loccalhost::${port}`);
})
