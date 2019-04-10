function loaded(){
	var logged = $('[data-icon="chat"]').length;
	var not_logged = $('[name="rememberMe"]').length
	//console.log(logged, not_logged)
	if(logged==0&&not_logged==0){
		setTimeout(loaded, 500)
	}else{
		if(logged>0){
			run()
		}else{
			//console.log('Não ta logado')
		}
	}
}
loaded();


const eventFire = (el, etype) => {
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
	el.dispatchEvent(evt);
}


var run = ()=>{
	window.ws = new WebSocket('ws://localhost:8080')
	ws.onmessage = function (result){
		var result = result.data.split('|')
		queue.push({
			number: result[0],
			message: result[1]
		})
	}

	const mainEl = document.body.childNodes[1].childNodes[0].lastElementChild
	const mainChat = mainEl.childNodes[2].firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild


	const selectChat = function (number,message, cb){
		eventFire(mainChat, 'mousedown')
		setTimeout(()=>{
			sendMessage('https://web.whatsapp.com/send?phone='+encodeURI(number)+'&text='+encodeURI(message), ()=>{
				var link = mainEl.querySelector('.copyable-area').lastChild.lastChild.lastChild.querySelector('a')
				eventFire(link,'click')
					setTimeout(()=>{
						eventFire(mainEl.querySelector('span[data-icon="send"]'), 'click');
						queue.shift()
						//console.log(new Date().getTime())
						readQueue()
					},500);
			})
		},500);
		//setTimeout(cb,1500);
	}

	const sendMessage = function(message, cb){
		var messageBox = mainEl.querySelector('[contenteditable]')
		messageBox.innerHTML=message
		event = document.createEvent("UIEvents");
		event.initUIEvent("input", true, true, window, 1);
		messageBox.dispatchEvent(event);
		eventFire(mainEl.querySelector('span[data-icon="send"]'), 'click');
		setTimeout(cb,500);
		//setTimeout(cb,500);
	}

	var queue = [];
	var readQueue = function (){
		if(queue.length>0){
			selectChat(queue[0].number,queue[0].message)
		}else{
			//console.log('N tem mensagem a ser enviada');
			setTimeout(readQueue,1000)
		}
	}
	readQueue()
}


/*
function run(){
	//console.log('Tentando conectar ao socket')
	window.ws = new WebSocket('ws://localhost:8080')
	ws.onopen = function () {
		ws.send('ping');
	};
	
	var mainEl = document.body.childNodes[1].childNodes[0].lastElementChild
	var mainChat = mainEl.childNodes[2].firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild

	ws.onmessage= function (message){
		if(message.data=='ping'){
			//console.log('Conexão testada com sucesso')
		}else{
			eventFire(mainChat, 'mousedown')
			var number = message.data.split('|')[0];
			var message = message.data.split('|')[1];
			var messageBox = document.querySelectorAll("[contenteditable='true']")[0]
			messageBox.innerHTML = message
		}
	}
}

*/