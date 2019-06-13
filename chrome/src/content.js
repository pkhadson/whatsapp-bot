


window.ws = new WebSocket('ws://localhost:8080')


const eventFire = (el, etype) => {
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
	el.dispatchEvent(evt);	
}






function run(){


	const mainEl = document.body.childNodes[0].childNodes[0].lastElementChild
	const mainChat = mainEl.childNodes[2].firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild


	const selectChat = function (number,message, cb){
		eventFire(mainChat, 'mousedown')
		setTimeout(()=>{
			sendMessage('https://web.whatsapp.com/send?phone='+encodeURI(number)+'&text='+encodeURI(message), ()=>{
				var link = mainEl.querySelector('.copyable-area').lastChild.lastChild.lastChild.querySelector('a')
				eventFire(link,'click')
					setTimeout(()=>{
						var checkLoad = function (){
							var text = $('[class*=app-wrapper-web] > *:not(div)').text()
							console.log(text)
							if(text==''){
								eventFire(mainEl.querySelector('span[data-icon="send"]'), 'click');
								queue.shift()
								readQueue()
							}else{
								setTimeout(checkLoad, 1000);
							}
						}
						checkLoad();
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
		console.log('LER FILA')
		if(queue.length>0){
			selectChat(queue[0].number,queue[0].message)
		}else{
			
			var title_browser = $('title').text();
			if(title_browser.replace(/[^0-9]/g, '')!=''){
				var scrollchats = mainEl.children[2].firstElementChild.children[3];
				var last_st = scrollchats.scrollTop;
				var scrolldown = function (){
					var title_browser = $('title').text();
					if(title_browser.replace(/[^0-9]/g, '')=='') {console.log('A');return;}
					var an_unread = mainEl.children[2].firstElementChild.children[3].querySelector("div > span > div > span:not([data-icon])");
					if(an_unread==null){
						scrollchats.scrollTop+=200;
						if(last_st==scrollchats.scrollTop) {setTimeout(readQueue,1000);scrollchats.scrollTop = 0;return;}
						last_st = scrollchats.scrollTop
						setTimeout(scrolldown,500)
					}else{
						scrollchats.scrollTop = 0;
						eventFire(an_unread, 'mousedown')
						setTimeout(function (){
							var message_out = mainEl.querySelectorAll('.message-out');
							message_out = message_out[message_out.length-1]
							message_out = $(message_out).parent()
							message_out.nextAll().each(function (){
								console.log($(this).find('[dir="ltr"]').text())
							})
							setTimeout(readQueue,1000)
						},1000)
					}			
				}
				scrolldown()
			}else{
				scrollchats.scrollTop = 0;
				setTimeout(readQueue,1000)
			}
		}
	}


	/*queue.push({
		number:'5534991476764',
		message: 'TESTE'
	})*/

	readQueue()


}

function loaded(){console.log('---')
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