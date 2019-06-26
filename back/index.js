const { exec } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const request = require("request");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


console.log('LENDO BANCO DE DADOS DE ENDPOINTS');
var endpoints = fs.readFileSync(__dirname+'/endpoint.json', 'utf8');
endpoints = JSON.parse(endpoints)

var queue = []

const functions = {
	sendMessage: (number, text)=>{
		console.log('PREPARANDO PARA ENVIAR UMA MENSAGEM')
		var url = 'http://wa.me/'+number+'?text='+text;
		url=url.replace(/ /g,'+')
		console.log(url)
		exec('adb shell "am start -a android.intent.action.VIEW -d '+url+' && sleep 1 && input tap 220 300 && am start -a android.intent.action.VIEW -d http://wa.me/553432937100"');
		console.log('MENSAGEM ENVIADA COM SUCESSO')
	},
	parseNumDate: (num)=>{
		num = ""+num;
		if(num.length==1) return '0'+num;
		return num
	}
}


app.post('/uratelekinho/endpoint', function (req, res) {
	const fields = req.body
	endpoints[fields.phone] = fields.ended
	console.log("NOVA ATUALIZAÇÃO DE ENDPOINT - "+fields.phone+' - '+fields.ended);
	fs.writeFileSync(__dirname+'/endpoint.json', JSON.stringify(endpoints), 'utf8');
	res.send('ok')
});

app.post('/uratelekinho/message', function (req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	//res.send('OK')
	var msg1 = req.body.text.toLowerCase().replace(/[^a-z ]/g, '');
	console.log(msg1, req.body.text)
	var data = [req.body.phone]

	var endpoint = data[0].slice(2, 4)+'9'+data[0].slice(4,33333)
	if(endpoints[endpoint]){
		endpoint = endpoints[endpoint]
	}else{
		endpoint = 'MENU PRINCIPAL'
	}
	if(msg1=='me ligue'){
		request("http://192.168.100.4/uratelek/retorno.php?telefone="+data[0].slice(2, 4)+'9'+data[0].slice(4,33333));
		res.send('Ok! Estou te ligando.')
	}else if(msg1.indexOf('saldo')>=0){
		var _date = new Date();
		var date = _date.getDate()+'/';
		date+= functions.parseNumDate(_date.getMonth()+1)+'/';
		date+= _date.getFullYear()+' ';
		date+= functions.parseNumDate(_date.getHours())+':';
		date+= functions.parseNumDate(_date.getMinutes())
		res.send('Seu saldo em '+date+' é de R$'+Math.floor(Math.random()*1000)+','+Math.floor(Math.random()*100)+' disponível para antecipação.');
	}else if(msg1=='oi' || msg1=='olá'){
		res.send('Olá! Você parou no '+(endpoint)+'! Vamos prosseguir com o nosso atendimento... Como posso ajudar?')
	}else if(msg1.indexOf('horas')>-1 || msg1.indexOf('hora')>-1){
		var _date = new Date();
    	var date = functions.parseNumDate(_date.getHours())+':';
        date+= functions.parseNumDate(_date.getMinutes())
		res.send('Agora são '+date);
	}else if(msg1.indexOf('dia')>-1 || msg1.indexOf('hoje')>-1){
		var _date = new Date();
		var date = _date.getDate()+'/';
        date+= functions.parseNumDate(_date.getMonth()+1)+'/';
        date+= _date.getFullYear();
        res.send('Hoje é '+date);
	}else if(msg1.indexOf('eu')>-1){
		res.send('Você é um cliente ValeCard! Falando comigo através do telefone '+data[0]);
	}else{
		res.send('Desculpe! Sou novato! Não entendi o que quis dizer. Caso queira falar com um de meus colegas basta digitar *me ligue*');;
	}
})

console.log('INCIANDO SERVIDOR NGIX');
app.listen(3000, function () {
	console.log('SERVIDOR NGIX INICIADO http://192.168.100.180:3000');
});

/*const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const WebSocket = require('ws')
const request = require("request");

console.log('LENDO BANCO DE DADOS DE ENDPOINTS');
var endpoints = fs.readFileSync(__dirname+'/endpoint.json', 'utf8');
endpoints = JSON.parse(endpoints)



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/uratelekinho/endpoint', function (req, res) {
	const fields = req.body
	endpoints[fields.phone] = fields.ended
	console.log("NOVA ATUALIZAÇÃO DE ENDPOINT - "+fields.phone+' - '+fields.ended);
	fs.writeFileSync(__dirname+'/endpoint.json', JSON.stringify(endpoints), 'utf8');
	res.send('ok')
});
console.log('INCIIANDO SERVIDOR NGIX');
app.listen(3000, function () {
	console.log('SERVIDOR NGIX INICIADO http://192.168.100.18:3000');
});

const wss = new WebSocket.Server({ port: 3001 })


var parseNumDate = function (num){
	num = ""+num;
	if(num.length==1) return '0'+num;
	return num
}

wss.on('connection', ws => {
	ws.on('message', data => {
		data = data.split('|')
		var msg1 = data[1].toLowerCase().replace(/[^a-z ]/g, '');
		if(msg1=='me ligue'){
			request("http://192.168.100.4/uratelek/retorno.php?telefone="+data[0]);
			return ws.send(data[0]+'|'+'Ok! Estou te ligando.')
		}else if(msg1.indexOf('saldo')>=0){
			var _date = new Date();
			var date = _date.getDate()+'/';
			date+= parseNumDate(_date.getMonth()+1)+'/';
			date+= _date.getFullYear()+' ';
			date+= parseNumDate(_date.getHours())+':';
			date+= parseNumDate(_date.getMinutes())
			return ws.send(data[0]+'|'+'Seu saldo em '+date+' é de R$'+Math.floor(Math.random()*1000)+','+Math.floor(Math.random()*100)+' disponível para antecipação.');
		}else if(msg1=='oi' || msg1=='olá'){
			ws.send(data[0]+'|'+'Olá! Você parou no '+(endpoints[data[0]])+'! Vamos prosseguir com o nosso atendimento... Como posso ajudar%3F')
		}else if(msg1.indexOf('horas')>-1){
			var _date = new Date();
                        var date = parseNumDate(_date.getHours())+':';
                        date+= parseNumDate(_date.getMinutes())
			ws.send(data[0]+'|'+'Agora são '+date);
		}else if(msg1.indexOf('dia')>-1){
			var _date = new Date();
			var date = _date.getDate()+'/';
                        date+= parseNumDate(_date.getMonth()+1)+'/';
                        date+= _date.getFullYear();
                        ws.send(data[0]+'|'+'Hoje é '+date);
		}else if(msg1.indexOf('eu')>-1){
			return ws.send(data[0]+'|'+'Você é um cliente ValeCard! Falando comigo através do telefone '+data[0]);
		}else{
			return ws.send(data[0]+'|'+'Desculpe! Sou novato! Não entendi o que quis dizer. Caso queira falar com um de meus colegas basta digitar *me ligue*');;
		}
		console.log(endpoints[data[0]], data)
		//ws.send(data[0]+'|'+data[1])
	})
})

*/