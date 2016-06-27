function Calendar (para){
	this.defaults={
		start_year:1950,
		end_year:2049,
		input:'',
	},
	this.set={}	,
	this.calendar='';
	this._init(para);

};

Calendar.prototype={
	_init:function(){
	 if(document.getElementsByTagName('calendar')[0]){
	 	document.getElementsByTagName('calendar')[0].style.display='block';
	 }else{
		var cfg,container;
		cfg=arguments[0];
		
		container=arguments.length>1?document.getElementById(arguments[1]):document.body;

		for (var i in this.defaults){
			this.set[i]=cfg[i] ? cfg[i] : this.defaults[i];
		}
		var myDate=new Date();
		var year=myDate.getFullYear();
		var month=myDate.getMonth();
		var date=new Date().getDate();

		this.set.year=year;
		this.set.month=month;
		this.set.date=date;
	//当天信息
		// this.set.currentYear=year;
		// this.set.currentMonth=month;
		// this.set.currentDate=date;

		var calendar=this._createCalendar(this.set);
		this.calendar=calendar;
		container.appendChild(calendar);
	 }
  },
	_createCalendar:function(set){
		var div=document.createElement('calendar');
		
		div.className='calendar';
	// 日历头
		var calendar_head=document.createElement('div');	
		var calendar_head_select1='';
		var calendar_head_select2='';
		calendar_head.className='calendar_head';

		for (var i=set.start_year;i<=set.end_year;i++){
			if(i==set.year){
				calendar_head_select1+='<option selected="selected">'+i+'</option>';
			}else{
				calendar_head_select1+='<option>'+i+'</option>';
			}
		}
		for (var i=1;i<=12;i++){
			if(i==set.month+1){
				calendar_head_select2+='<option selected="selected">'+i+'</option>';

			}else{
				calendar_head_select2+='<option>'+i+'</option>';
			}
		}
		calendar_head.innerHTML='<span class="backward"><</span><select class="select">'+calendar_head_select1
							+'</select><select class="select">'+calendar_head_select2
							+'</select><button>返回</button><span class="forward">></span>';
		div.appendChild(calendar_head);

	// 日历体
		var calendar_body=document.createElement('div');

		this._calendarBody(div,calendar_body,set);
	// 设置年月
		this._changeDate(div,calendar_head,calendar_body,set);

		return div;
	},

	_calendarBody:function(content,calendar_body,set){
		calendar_body.innerHTML='';
		calendar_body.className='calendar_body';
		calendar_body.innerHTML='<table><thead class="thead">'
							+'<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>'
							+'</thead><tbody class="tbody"></tbody></table>';

		var week=new Date(set.year,set.month).getDay() ; //当前月第一天为星期几
		var dayCount=new Date(set.year,set.month+1,0).getDate();// 当前月的天数
		var preMonDayCount=new Date(set.year,set.month,0).getDate() ;// 之前一个月的天数

		set.week=week;
		set.dayCount=dayCount;

		var tbody=calendar_body.getElementsByTagName('tbody')[0];
		var rows=Math.ceil((dayCount+week)/7); //计算不同月所需的行数
		var tr='';
		for (var i=0;i<rows;i++){
			var td='';
			for (var j=0;j<7;j++){
				td+='<td></td>';
			}
			tr+='<tr class="trow">'+td+'</tr>';
		}
		tbody.innerHTML=tr;
		var td=tbody.getElementsByTagName('td');
		for (var i=0;i<td.length;i++){
			if(i<week){
				td[i].innerHTML=preMonDayCount-week+1+i;
				td[i].className='notCurrentmonDay';
			}
			if(i>=week && i<week+dayCount){
				td[i].innerHTML=i-week+1;
				td[set.date+week-1].className='currentDate';
			}
			if(i>=week+dayCount){
				td[i].innerHTML=i-week-dayCount+1;
				td[i].className='notCurrentmonDay';			
			}
		}

		content.appendChild(calendar_body);
		this._getTime(tbody,set);
	},

	_getTime:function(tbody,set){
		var that=this;
		var td=tbody.getElementsByTagName('td');
		var time='';
		
		tbody.addEventListener('click',getTime,false);

		function getTime(event){
			var event=event || window.event;
			var target=event.target || event.srcElement;
// console.log(set)
			for(var i=set.week;i<set.week+set.dayCount;i++){
				if(target==td[i]){
					time=td[i].innerHTML;
					document.getElementById(set.input).value=set.year+'-'+parseInt(set.month+1)+'-'+time;
				}

			}
			event.stopPropagation();
			// console.log(that);/
			that._hideCalendar();
		}
	},
	_hideCalendar:function(){
		this.calendar.style.display='none';
	},
	_changeDate:function(content,calendar_head,calendar_body,set){
		var that=this;
		var selectYear=calendar_head.getElementsByTagName('select')[0];
		var selectMonth=calendar_head.getElementsByTagName('select')[1];

		calendar_head.addEventListener('change',function(event){
			var event=event || window.event;
			var target=event.target || event.srcElement;
			if(target==selectYear){
				var index=selectYear.selectedIndex;
				console.log(index);
				set.year=selectYear.options[index].text;
			}
			if(target==selectMonth){
				var index=selectMonth.selectedIndex;
				set.month=selectMonth.options[index].text-1;
			}
		
			that._calendarBody(content,calendar_body,set);
		},false);
		calendar_head.addEventListener('click',function(event){
			var event=event || window.event;
			var target=event.target || event.srcElement;
			var month_index=selectMonth.selectedIndex; // index=0~11
			var year_index=selectYear.selectedIndex;
		//前进
			if(target.className=='forward'){
				if(selectYear.options[year_index].value<set.end_year){
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
				if(selectYear.options[year_index].value>set.start_year){
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
			set.year=selectYear.options[year_index].text;
			set.month=selectMonth.options[month_index].text-1;
			selectYear.options[year_index].selected='selected';
			selectMonth.options[month_index].selected='selected';
			// console.log(month_index+','+set.month);
			that._calendarBody(content,calendar_body,set);
			
		},false);
	}
}





























