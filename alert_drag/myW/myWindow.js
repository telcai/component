function myWindow(){

	this.defaults={
		width:300,
		height:240,
		title:'弹框提示',
		content:'弹框内容',
		btn1:'确定',
		btn2:'取消',
		cover:false,
		theme:null,
		dragable:true,
		resize:true,
		btn1_handler:function(){alert('you click the btn1')},
		btn2_handler:function(){alert('you click the btn2')}
	},
	this.set={}
	// this.closeBox=closeBox();
}

myWindow.prototype={

	alert:function(cfg){
		//参数合并
		for (var i in this.defaults){
			this.set[i]=cfg[i] ? cfg[i] : this.defaults[i];
		}
		var set=this.set;
		
		//初始化弹框
		var Box=document.createElement('div');
			Box.className='box';
			Box.style.cssText="width:"+set.width+"px; height:"+set.height+"px;margin:-"+set.height/2+'px 0px 0px -'+set.width/2+'px;';

			Box.innerHTML='<div class="alertTitle" ><p>'
						+set.title
						+'</p></div><div class="alertContent">'
						+set.content
						+'</div><div class="alertFoot"><button class="alertBtn" >'
						+set.btn1
						+'</button><button class="alertBtn" >'
						+set.btn2
						+'</button></div>';

			document.body.appendChild(Box);

	// 给按钮绑定事件
			// document.getElementById('alert_btn1').addEventListener('click',function(){
			// 	set.btn1_handler();
			// 	closeBox(Box,set);
			// },false);
			// document.getElementById('alert_btn2').addEventListener('click',function(){
			// 	set.btn2_handler();
			// 	closeBox(Box,set);
			// },false);   //出错
// 
// 注：不能使用id标记，当出现多个弹框时，ID会出现重复
			Box.getElementsByTagName('button')[0].addEventListener('click',function(){
				set.btn1_handler();
				closeBox(Box,set);
			},false);
			
			Box.getElementsByTagName('button')[1].addEventListener('click',function(){
				set.btn2_handler();
				closeBox(Box,set);
			},false);

			//遮罩层
			if(set.cover){
				var Cover=document.createElement('div');
					Cover.className='cover';
					Cover.id='cover';
					document.body.appendChild(Cover);
					Cover.addEventListener('click',function(){
						closeBox(Box,set);

					},false);
			}

			//拖拽
			if(set.dragable){
				dragBox(Box);
			}

			if(set.resize){
				
				var resizeBar=document.createElement('span');
				resizeBar.className='resizeBar';
				var divs=Box.getElementsByTagName('div');
				var footer=divs[divs.length-1];
				// console.log(divs);
				footer.appendChild(resizeBar);

				resizeBox(Box,resizeBar);
			}


	},

	conform:function(){ },
	prompt:function(){ },


}  //prototype



function closeBox(box,set){
	box.parentNode.removeChild(box);
	if(set.cover){
		var cover=document.getElementById('cover');
		document.body.removeChild(cover);

	}

};


function dragBox(box){
	var box_title=box.getElementsByTagName('div')[0];
	box_title.style.cursor='move';
	box_title.addEventListener('mousedown',mouseDown,false);

	function mouseDown(event){
		var event=event || window.event;
		var disX=event.clientX-box.offsetLeft;
		var disY=event.clientY-box.offsetTop;

		document.addEventListener('mousemove',mouseMov,false);
		document.addEventListener('mouseup',mouseUp,false);


		function mouseMov(event){
			
			box.style.margin="0px";  //清楚初始化时用于居中的margin

			var event=event || window.event;
		
			var new_X=event.clientX-disX>0 ? event.clientX-disX : 0,  //判断左上边界
				new_Y=event.clientY-disY>0 ? event.clientY-disY : 0

			var win_X=document.documentElement.clientWidth-parseInt(box.style.width), //判断右下边界
				win_Y=document.documentElement.clientHeight-parseInt(box.style.height)

				// console.log(document.documentElement.clientHeight+ "   "+document.body.clientHeight +"  "+win_Y)
			if(new_X>win_X){
				new_X=win_X;
			}
			if(new_Y>win_Y){
				new_Y=win_Y;
			}

			box.style.left=new_X+'px';
			box.style.top=new_Y+'px';

		}
		function mouseUp(){
			document.removeEventListener('mousemove',mouseMov,false);
		}

	}

};  //dragBox


function resizeBox(box,bar){
	bar.addEventListener('mousedown',resizeDown,false);
	function resizeDown(event){
		var event=event || window.event;
		// var disX=event.clientX,
			// disY=event.clientY

			document.addEventListener('mousemove',resizeMov,false);
			document.addEventListener('mouseup',resizeUp,false);

			function resizeMov(event){

				bar.style.cursor='se-resize';

				var event=event || window.event
				var mov_X,mov_Y
				var disX=parseInt(box.style.width)+box.offsetLeft,
					disY=parseInt(box.style.height)+box.offsetTop

				if(disX-document.documentElement.clientWidth>-10){
					// mov_X=document.documentElement.clientWidth-disX;
					box.style.width=document.documentElement.clientWidth-box.offsetLeft-5+'px';

				}else{
					mov_X=event.clientX-disX;

				}
				if(disY-document.documentElement.clientHeight>-10){
					// mov_Y=document.documentElement.clientHeight-disY;
					box.style.height=document.documentElement.height-box.offsetTop-5+'px';

				}else{
					mov_Y=event.clientY-disY;
				}


				box.style.width=parseInt(box.style.width)+mov_X+'px';
				box.style.height=parseInt(box.style.height)+mov_Y+'px';
			}

			function resizeUp(){
				document.removeEventListener('mousemove',resizeMov,false);
				document.removeEventListener('mouseup',resizeUp,false);

			}
	}

}



//HTML--- document.body.clientHeight;body高度
//XHTML--- document.documentElement.clientHeight; --可视区高度，



