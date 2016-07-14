var Calendar=(function(){
	var defaults={
			start_year:1950,
			end_year:2049,
			input:'',
			handler:function(){
				alert('callback!');
			},
			period:[false,2,15]
		};
	var set={};
	var infor=set;
	var Input='';  //填写日期的位置
	var	calendar='';
	var calendar_head_select=''; 
	var	calendar_body=document.createElement('div');
	var selected=''; //初始化_getDayTime()中的选中目标
	var td='';
	var	calendar_footer='';
	var selectedArr=[];//初始化_getPeriodTime()中的选中目标
	var puttedDate=[];//初始化由_getPeriodTime()放入input中的值

	var _create=function(para){
		var cfg=arguments[0];
		container=arguments.length>1?document.getElementById(arguments[1]):document.body;
		for (var i in defaults){
			set[i]=cfg[i] ? cfg[i] : defaults[i];
		};
		if(container.getElementsByTagName('calendar')[0]){
			calendar.style.display='block';
		}else{
			_init(cfg);
		}	
	};
	var oDate=new Date();
	infor.year=oDate.getFullYear();
	infor.month=oDate.getMonth();
	infor.date=oDate.getDate();

	function _init(){
		Input=document.getElementById(set.input);
		calendar=document.createElement('calendar');
		calendar.className='calendar';
		// console.log(set.period[0])
	//calendarHead
		_calendarHead();
	//calendarBody
		_calendarBody();
		container.appendChild(calendar);
	}


	function _calendarHead(){
		var calendar_header=document.createElement('div');
		var select1='',select2=''

		calendar_header.innerHTML='<div class="calendar_header"><span class="backward"><</span>'
								+'<select class="select1"></select><select class="select2"></select>'
								+'<span class="forward">></span></div>';

		calendar_head_select=calendar_header.getElementsByTagName('select');
		var calendar_head_button=calendar_header.getElementsByTagName('span');

		for (var i=infor.start_year;i<=infor.end_year;i++){
			if(i==infor.year){
				select1+='<option selected="selected">'+i+'</option>';
			}else{
				select1+='<option>'+i+'</option>';
			}
		}
		for (var i=1;i<=12;i++){
			if(i==infor.month+1){
				select2+='<option selected="selected">'+i+'</option>';
			}else{
				select2+='<option>'+i+'</option>';
			}
		}
		calendar_head_select[0].innerHTML=select1;
		calendar_head_select[1].innerHTML=select2;
		calendar.appendChild(calendar_header);

		_changeDate(calendar_header);	
	} //_calendarHead()

	function _calendarBody(){
		calendar_body.innerHTML='';
		calendar_body.className='calendar_body';
		calendar_body.innerHTML='<table>'
							   +'<thead class="thead">'
							   +'<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>'
							   +'</thead>'
							   +'<tbody class="tbody"></tbody>'
							   +'</table>'
							   +'<div class="calendar_footer"><button>确认</button><button>取消</button></div>';
		calendar_footer=calendar_body.getElementsByTagName('div')[0]

		var week=new Date(infor.year,infor.month).getDay() ; //当前月第一天为星期几
		var dayCount=new Date(infor.year,infor.month+1,0).getDate();// 当前月的天数
		var preMonDayCount=new Date(infor.year,infor.month,0).getDate() ;// 之前一个月的天数

		infor.week=week;
		infor.dayCount=dayCount;

		var tbody=calendar_body.getElementsByTagName('tbody')[0];
		var rows=Math.ceil((dayCount+week)/7); //计算不同月所需的行数
		var tr='';
		for (var i=0;i<rows;i++){
			td='';
			for (var j=0;j<7;j++){
				td+='<td></td>';
			}
			tr+='<tr class="trow">'+td+'</tr>';
		}
		tbody.innerHTML=tr;

	 	td=tbody.getElementsByTagName('td');
		for (var i=0;i<td.length;i++){
			if(i>=week && i<week+dayCount){
				td[i].innerHTML=i-week+1;
				td[infor.date+infor.week-1].className='currentDate';	
			}
		}
		infor.currentDate=td[infor.date+infor.week-1];
		_markDate();

		calendar.appendChild(calendar_body);
	//选择方式，区域选择还是一天选择

		if(set.period[0]){
			tbody.addEventListener('click',function(event){
				_getPeriodTime(event);
			},false);
			var button=calendar_footer.getElementsByTagName('button');
		
			calendar_footer.addEventListener('click',function(event){
				_putPeriodDate(event,button);
			},false);
		}else{
			tbody.addEventListener('click',function(event){
				_getDayTime(event);
			},false);
			var button=calendar_footer.getElementsByTagName('button');
				calendar_footer.addEventListener('click',function(event){
				_putDayDate(event,button);
			},false);
		}
	}  //_calendarBody()


	function _changeDate(calendar_header){
		var year_index='';  //当前选中月的index
		var month_index=''; //当前选中年的index

		month_index=calendar_head_select[1].selectedIndex; // index=0~11
		year_index=calendar_head_select[0].selectedIndex;

		calendar_header.addEventListener('change',function(event){
			var event=event || window.event;
			var target=event.target || event.srcElement;
			if(target==calendar_head_select[0]){
				year_index=calendar_head_select[0].selectedIndex;
				infor.year=calendar_head_select[0].options[year_index].text;
			}
			if(target==calendar_head_select[1]){
				month_index=calendar_head_select[1].selectedIndex;
				infor.month=calendar_head_select[1].options[month_index].text-1;
			}
			_calendarBody();

		},false);

		calendar_header.addEventListener('click',function(event){
			var event=event || window.event;
			var target=event.target || event.srcElement;
		//前进
			if(target.className=='forward'){
				if(calendar_head_select[0].options[year_index].value<set.end_year){
					if(month_index+1>11){
						month_index=0;
						year_index+=1;
					}else{
						month_index+=1;
					}
				}else{
					if(month_index>=10){
						target.style.visibility='hidden';
						month_index+=1;

					}else{
						month_index+=1;
					}
				}
			}	
		// 后退
			if(target.className=='backward'){
				if(calendar_head_select[0].options[year_index].value>set.start_year){
					if(month_index-1<0){
						month_index=11;
						year_index-=1;
					}else{
						month_index-=1;
					}
				}else{
					if(month_index-1<=0){
						target.style.visibility='hidden';
						month_index-=1;
					}else{
						month_index-=1;
					}
				}
			}
			infor.year=calendar_head_select[0].options[year_index].text;
			infor.month=calendar_head_select[1].options[month_index].text-1;
			calendar_head_select[0].options[year_index].selected='selected';
			calendar_head_select[1].options[month_index].selected='selected';	

			_calendarBody();

		},false);

	} //_changeDate 

	function _getDayTime(event){
		var seconds=(new Date(infor.year+'/'+parseInt(infor.month+1))).getTime();
		var event=event || window.event;
		var target=event.target || event.srcElement;
		
		if(target.innerHTML!=''){
			if(selectedArr[0]){
				selectedArr[0][1].className=selectedArr[0][1].className.replace('selectedDate',''); //删除指定classname
			}
			target.className=target.className.match('currentDate')?'currentDate selectedDate':'selectedDate';
			selectedArr[0]=[seconds,target];	
		}	
	}//_getDayTime()
	function _putDayDate(event,button){
		var event=event || window.event;
		var target=event.target || event.srcElement;

		if(target==button[0]){
			Input.value=set.year+'-'+parseInt(set.month+1)+'-'+selectedArr[0][1].innerHTML;
			set.handler && set.handler();	
			calendar.style.display='none';
			puttedDate[0]=selectedArr[0];

		}
		if(target==button[1]){
			calendar.style.display='none';
			selectedArr[0][1].className=selectedArr[0][1].className.replace('selectedDate','');
			selectedArr[0]=puttedDate[0];
			selectedArr[0][1].className=selectedArr[0][1].className.match('currentDate')?'currentDate selectedDate':'selectedDate';
			_markDate();
		}

	}

	function _getPeriodTime(event){

		var event=event || window.event;
		var target=event.target || event.srcElement;
		var temp='';

		if(!target.innerHTML==''){
			var seconds=(new Date(infor.year+'/'+parseInt(infor.month+1))).getTime();
			if(selectedArr.length==2){
				temp=selectedArr.shift();  //出队
				selectedArr.push([seconds,target]);
				td[parseInt(temp[1].innerHTML)+infor.week-1].className=td[parseInt(temp[1].innerHTML)+infor.week-1].className.replace('selectedDate','');
				// console.log(td[parseInt(temp[1].innerHTML)+infor.week-1]);
			}else{
				selectedArr.push([seconds,target]);
			}
			selectedArr[0][1].className=selectedArr[0][1].className.match('currentDate')?'currentDate selectedDate':'selectedDate';
			selectedArr[1][1].className=selectedArr[1][1].className.match('currentDate')?'currentDate selectedDate':'selectedDate';
		//标记时间段	
			_markPeriod();
		}

	}//_getPeriodTime()

	function _putPeriodDate(event,button){
		var event=event||window.event;
		var target=event.target||event.srcElement;
		if(target==button[0]){   //确定按钮
			if(selectedArr.length<2){
				alert('请选择结束日期');
			}else{
				var _start=selectedArr[0][0]+parseInt(selectedArr[0][1].innerHTML)*60*60*24*1000;
				var _end=selectedArr[1][0]+parseInt(selectedArr[1][1].innerHTML)*60*60*24*1000;
				// console.log(selectedArr[0][1])
				if(Math.abs(_start-_end)<parseInt(set.period[1])*60*60*24*1000||Math.abs(_start-_end)>parseInt(set.period[2])*60*60*24*1000){
					alert('选择范围错误！请重新选择');
				}else if(_start>_end){
					var _temp=selectedArr[0];
					selectedArr[0]=selectedArr[1];
					selectedArr[1]=_temp;
					putdate();
				}else{
					putdate();
				}					
			}
		}
		if(target==button[1]){
			calendar.style.display='none';
			
			selectedArr[0][1].className=selectedArr[0][1].className.replace('selectedDate','');
			selectedArr[1][1].className=selectedArr[1][1].className.replace('selectedDate','');
			selectedArr[0]=puttedDate[0];
			selectedArr[1]=puttedDate[1];
			selectedArr[1][1].className=selectedArr[1][1].className.match('currentDate')?'currentDate selectedDate':'selectedDate';
			_markDate();
		}

		function putdate(){
			puttedDate[0]=selectedArr[0];
			puttedDate[1]=selectedArr[1];
			var start_year=new Date(puttedDate[0][0]).getFullYear();
			var start_month=new Date(puttedDate[0][0]).getMonth()+1;
			var end_year=new Date(puttedDate[1][0]).getFullYear();
			var end_month=new Date(puttedDate[1][0]).getMonth()+1;

			if(set.period[3]){
				Input.value=start_year+set.period[3]+start_month+set.period[3]+puttedDate[0][1].innerHTML
						   +'-'
						   +end_year+set.period[3]+end_month+set.period[3]+puttedDate[1][1].innerHTML;

			}else{
				Input.value=start_year+'年'+start_month+'月'+puttedDate[0][1].innerHTML+'日'
						  +'-'
						  +end_year+'年'+end_month+'月'+puttedDate[0][1].innerHTML+'日';
			}
			set.handler&&set.handler();
			calendar.style.display='none';
		}

	}//_putDate()

	function _markDate(){
		if(set.period[0]&&selectedArr.length==2){  //片段时间
			if((new Date(infor.year+'/'+parseInt(infor.month+1))).getTime()==selectedArr[0][0]){
				td[parseInt(selectedArr[0][1].innerHTML)+infor.week-1].className='selectedDate';
				_markPeriod();
			}
			if((new Date(infor.year+'/'+parseInt(infor.month+1))).getTime()==selectedArr[1][0]){
				td[parseInt(selectedArr[1][1].innerHTML)+infor.week-1].className='selectedDate';
				_markPeriod();
			}

		}
		if(!set.period[0] && selectedArr.length==1){ //单天选择
			if((new Date(infor.year+'/'+parseInt(infor.month+1))).getTime()==selectedArr[0][0]){
				td[parseInt(selectedArr[0][1].innerHTML)+infor.week-1].className='selectedDate';
			}
		}
	}
	function _markPeriod(){
			var _s=parseInt(selectedArr[0][1].innerHTML);
			var _e=parseInt(selectedArr[1][1].innerHTML);
			if(selectedArr[0][0]==selectedArr[1][0]){		
				for (var i=1;i<td.length-infor.week+1;i++){
					if(i>_s && i<_e || i>_e && i<_s){
						// console.log(td[i+infor.week-1])
						td[i+infor.week-1].className='between';
					}else{
						td[i+infor.week-1].className=td[i+infor.week-1].className.replace('between','');
					}
				}
			}

			if(selectedArr[0][0]<selectedArr[1][0]){
				for (var i=1;i<td.length-infor.week+1;i++){
					if((new Date(infor.year+'/'+parseInt(infor.month+1))).getTime()==selectedArr[0][0]){
						if(i>_s){
							td[i+infor.week-1].className=td[i+infor.week-1].className.match('currentDate')?'currentDate between':'between';
							// console.log(td[i+infor.week-1]);
						}else{
						// console.log('h'+td[i+infor.week-1].innerHTML)
							td[i+infor.week-1].className=td[i+infor.week-1].className.replace('between','');
						}
					}
					if((new Date(infor.year+'/'+parseInt(infor.month+1))).getTime()==selectedArr[1][0]){
						if(i<_e){
							td[i+infor.week-1].className=td[i+infor.week-1].className.match('currentDate')?'currentDate between':'between';///////////////
						}else{
							td[i+infor.week-1].className=td[i+infor.week-1].className.replace('between','');
						}
					}
				}
			}

			if(selectedArr[0][0]>selectedArr[1][0]){
				for (var i=1;i<td.length-infor.week+1;i++){
					if((new Date(infor.year+'/'+parseInt(infor.month+1))).getTime()==selectedArr[0][0]){
						if(i<_s){
							td[i+infor.week-1].className=td[i+infor.week-1].className.match('currentDate')?'currentDate between':'between';
						}else{
							td[i+infor.week-1].className=td[i+infor.week-1].className.replace('between','');
						}
					}
					if((new Date(infor.year+'/'+parseInt(infor.month+1))).getTime()==selectedArr[1][0]){
						if(i>_e){
							td[i+infor.week-1].className=td[i+infor.week-1].className.match('currentDate')?'currentDate between':'between';
						}else{
							td[i+infor.week-1].className=td[i+infor.week-1].className.replace('between','');}
					}
				}
			}
	}


	return {create:_create}

})();



