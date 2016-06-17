var btn=document.getElementById('btn');

btn.onclick=function(){
	
	var win=new myWindow();

	win.alert({
		'width':400,
		'content':'弹框可拖拽，可放大缩小，具有最小宽高',
		'btn1':'yes',
		'btn2':'no'
	});
}
