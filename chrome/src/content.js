

const eventFire = (el, etype) => {

	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
	el.dispatchEvent(evt);	
}

var mainEl
var scroll
var lastScroll = 0;


var lastSC = 0;
function run(n){
	if(lastScroll==new Date().getSeconds()){
		console.error('aq')
	}
	lastScroll = new Date().getSeconds()
	console.log(lastScroll)
	if(n=='PRIMEIRA'){
		console.log('INICIANDO')
		mainEl = document.body.childNodes[0].childNodes[0].lastElementChild
		scroll = mainEl.children[2].firstElementChild.children[3]
	}
	var unread = scroll.querySelector("div > span > div > span:not([data-icon])");
	console.log(unread)
	if(!unread){
		console.log('n tem nada n lido')

		console.log('TENTA DESCER')
		lastScroll = scroll.scrollTop;
		scroll.scrollTop+=2000;
		if(lastScroll==scroll.scrollTop){
			scroll.scrollTop=0
			eventFire($('[title="+55 34 3293-7100"]').get(0),'mousedown')
			console.log('NÃO DESCE MAIS, volta pro topo')
		}else{
			console.log('DESCEU')
		}
		setTimeout(run,1000)
		return;
	}else{
		if($(unread).text()!='N'){
			unread.innerHTML = 'N'
			console.log('1 n lida')
			eventFire(unread,'mousedown')
			setTimeout(function (){
				var line_unread = $('#main > div > .copyable-area > [tabindex="0"]>div:last-child>div>span[class]:not([dir])').parent()
				var message = [];
				if($('#main footer [role="button"]').length>0){
					console.log('NOVO CHAT')
					$('.message-in').each(function (){
						message.push($(this).find('.selectable-text').text())
						var outs = $(this).find('.message-out').length
						console.log(outs, $(this).find('.message-out'))
						if(outs>0){
							message = []
						}
					})
				}else{
					line_unread.nextAll().each(function (){
						message.push($(this).find('.selectable-text').text())
						var outs = $(this).find('.message-out').length
						console.log(outs, $(this).find('.message-out'))
						if(outs>0){
							message = []
						}
					})
				}
				message = message.join(" \n")
				var params = {
					text: message,
					phone: $('#main header [dir]').text().replace(/[^0-9]/g, ''	)
				}
				var message_out = $.ajax({
					type: 'post',
					async: false,
					url: 'http://127.0.0.1:3000/uratelekinho/message',
					crossDomain: true,
					data: params
				}).responseText

				console.log(message_out)

				if(message && message!=""){
					var messageBox = mainEl.querySelector('[contenteditable]')
					messageBox.innerHTML = message_out
					eventFire(messageBox,'input')
					mainEl.querySelector('span[data-icon="send"]')
					eventFire(mainEl.querySelector('span[data-icon="send"]'), 'click');

					scroll.scrollTop=0
					eventFire($('[title="+55 34 3293-7100"]').get(0),'mousedown')
					console.log('1d')
					setTimeout(run,500)
				}else{
					setTimeout(run,500)
				}
			},5)
		}else{
			console.log('TENTA DESCER')
			lastScroll = scroll.scrollTop;
			scroll.scrollTop+=2000;
			if(lastScroll==scroll.scrollTop){
				scroll.scrollTop=0
				eventFire($('[title="+55 34 3293-7100"]').get(0),'mousedown')
				console.log('NÃO DESCE MAIS, volta pro topo')
			}else{
				console.log('DESCEU')
			}
			setTimeout(run,500)
		}

		/*if(!has_new){
			console.log('TENTA DESCER')
			lastScroll = scroll.scrollTop;
			scroll.scrollTop+=2000;
			if(lastScroll==scroll.scrollTop){
				scroll.scrollTop=0
				eventFire($('[title="+55 34 3293-7100"]').get(0),'mousedown')
				console.log('NÃO DESCE MAIS, volta pro topo')
				setTimeout(run,2000)
			}else{
				console.log('DESCEU')
				setTimeout(run,500)
			}
		}else{
			console.log('RODA DENOVO')
			setTimeout(run,500)
		}*/
	}
}

function checkLoad(){
	var icon_chat = $('[data-icon="chat"]').length
	if(icon_chat==0){
		console.log('Não carregou, tenta daqui 1s')
		setTimeout(checkLoad, 1000)
	}else{
		setTimeout(function(){run('PRIMEIRA')},1000);
	}
}

checkLoad()

/*


function run(){



	const mainEl = document.body.childNodes[0].childNodes[0].lastElementChild
	const mainChat = mainEl.childNodes[2].firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild


	const selectChat = function (number,message, cb){
		eventFire(mainChat, 'mousedown')
		setTimeout(()=>{
			sendMessage('https://web.whatsapp.com/send?phone='+encodeURI(number)+'&text='+(message.replace(/\ /g,'%20')), ()=>{
				var link = mainEl.querySelector('.copyable-area').lastChild.lastChild.lastChild.querySelector('a')
				console.log(link)
				eventFire(link,'click')
					setTimeout(()=>{
						var checkLoad = function (){
							var text = $('[class*=app-wrapper-web] > *:not(div)').text()
							console.log(text)
							if(text==''){
								console.log(mainEl.querySelector('span[data-icon="send"]'))
								setTimeout(function (){
									eventFire(mainEl.querySelector('span[data-icon="send"]'), 'click');
									queue.shift()
									readQueue()
								},300);
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
		setTimeout(cb,1000);
		//setTimeout(cb,500);
	}

	var queue = [];
	var readQueue = function (){
		eventFire(mainChat, 'mousedown')
		console.log('LER FILA', queue)
		if(queue.length>0){
			console.log('TEM');
			selectChat(queue[0].number,queue[0].message)
		}else{
			var scrollchats = mainEl.children[2].firstElementChild.children[3];	
			var title_browser = $('title').text();
			if(title_browser.replace(/[^0-9]/g, '')!=''){
				var last_st = scrollchats.scrollTop;
				var scrolldown = function (){
					var title_browser = $('title').text();
					if(title_browser.replace(/[^0-9]/g, '')=='') {console.log('A');return;}
					var an_unread = mainEl.children[2].firstElementChild.children[3].querySelector("div > span > div > span:not([data-icon])");
					if(an_unread==null){
						scrollchats.scrollTop+=200;
						if(last_st==scrollchats.scrollTop) {
							setTimeout(readQueue,1000);
							scrollchats.scrollTop = 0;
							return;
						}
						last_st = scrollchats.scrollTop
						setTimeout(scrolldown,500)
					}else{
						scrollchats.scrollTop = 0;
						eventFire(an_unread, 'mousedown')
						var chat = $(an_unread).closest('[style]').parent().parent().parent().parent().find('[title*="+55"]').attr('title');
						chat = chat.replace(/\+55 |-/g, '').replace(/-/g,'').replace(/\ /g,'9');
						setTimeout(function (){
							console.log('CHEGOU A');
							var message_out = mainEl.querySelectorAll('.message-out');
							message_out = message_out[message_out.length-1]
							message_out = mainEl.querySelector('div:nth-child(5)>div>div>div:nth-child(3)>div>span:only-child');
							message_out = mainEl.lastElementChild.children[0].children[4].children[0].lastElementChild.querySelectorAll('div>div:not([class*="copyable-text"])>div>span:only-child')
							console.log(message_out);
							message_out = $(message_out).parent();
							message_out.nextAll().each(function (){
								console.log(this)
								var filter = $(this).find('.message-in');
								if(filter.length==0) return;
								console.log(this)
								console.log($(this).find('[dir="ltr"]').text())
								if($(this).find('[dir="ltr"]').text()!='') ws.send(chat+'|'+$(this).find('[dir="ltr"]').text())
							})
							eventFire(mainChat, 'mousedown')
							setTimeout(readQueue,1000)
						},1000)
					}			
				}
				scrolldown()
			}else{
				scrollchats.scrollTop = 0;
				console.log('CHAMA');
				setTimeout(readQueue,1000)
			}
		}
	}


	/*queue.push({
		number:'5534999744352',
		message: 'TESTE'
	})

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
