const WebSocket = require('ws')
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {

    var qstMessage = function (){
        rl.question('Mensagem? ', (answer) => {
            ws.send(answer)
            qstMessage()
        })
    }

    qstMessage()



})
