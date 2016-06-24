function Table(){
	
	this.defaults={
		table_row:1,
		table_col:3,
		table_head:['a','b','c'],
		col_sort:[1,1,1],
		table_content:{
			1:[0,0,0]
		},
		table_head_fixed:false
	}
	this.set={};
}

Table.prototype={

	init:function(cfg){
	//参数合并
		for (var i in this.defaults){
	 		this.set[i] = cfg[i] ? cfg[i] : this.defaults[i];
		}
		var set=this.set;
		var table=createTable(table,set);
		return table;
	}
}

//创建表单

function createTable(table,set){
	var table=document.createElement('table');
	// table_head
	tableHead(table,set);	
	//table_content
	tableContent(table,set,set.table_content);
	//固定表单头
	if(set.table_head_fixed){
		headFixed(table);
	}

	return table;
};

function tableHead(table,set){
	var thead=document.createElement('tr');
		thead.className='trow';
	var th='';
	for (var i=0; i<set.table_col; i++){
		th+='<th class="tdata" col_th='+i+'>'+set.table_head[i]
			+'<div class="sort_icon"><img src="table_plugin/sort35.png" /><span class="up"></span><span class="down"></span></div>'
			+'</th>';
	}
		//绑定排序事件
	thead.innerHTML=th;
	thead.addEventListener('click',function(event){   /////////事件委托
		var event=event || window.event;
		var target=event.target || event.srcElement;
		if(target.nodeName.toUpperCase()=='SPAN'){
			Sorting(event,table,set);
		}  

	},false);

	var sort_icon=thead.getElementsByTagName('div');	
	for (var i=0;i<set.table_col;i++){
		if(set.col_sort[i]){
			sort_icon[i].style.display='block';
		}

	}
	table.appendChild(thead);
}

function tableContent(table,set,data){
	// console.log(data)
	var tbody=document.createElement('tbody');
	var tr='';
	for (var i=0;i<set.table_row;i++){
		var td='';
		for (var j=0;j<set.table_col;j++){			
			td+='<td class="tdata">'+data[i+1][j]+'</td>';
		}
		tr+='<tr class="trow">'+td+'</tr>';
	}
	tbody.innerHTML=tr;
	table.appendChild(tbody);
}

//表单排序 
	function Sorting(event,table,set){
		var sort_type=eventTarget.className;
		var col_th=eventTarget.parentNode.parentNode.getAttribute('col_th');  //获取被点击目标所在的列数
		var newArr=[];
		for (var i=0;i<set.table_row; i++){
	
			newArr[i]=set.table_content[i+1];		
		}
			if(sort_type=='up'){
				newArr.sort(function(a,b){
					return a[col_th]-b[col_th];
				}); //这里newArr为排序好的数组
			}else{
				newArr.sort(function(a,b){
					return b[col_th]-a[col_th];
				}); //这里newArr为排序好的数组
		}

		for(var i=0;i<set.table_row; i++){
			set.table_content[i+1]=newArr[i];
		}
		table.innerHTML='';
		tableHead(table,set);
		tableContent(table,set,set.table_content);

	};//Sorting


function headFixed(table){
	var thead=table.getElementsByTagName('tr')[0];
	var content_0=table.getElementsByTagName('tbody')[0];
	var content_last=table.getElementsByTagName('tr')[table.getElementsByTagName('tr').length-1]
	var temp=document.createElement('div');
	var flag=0;
		temp.className='thead_temp';
		table.insertBefore(temp,content_0);


	window.addEventListener('scroll',function(event){
	// console.log(document.body.scrollTop+"..."+table.offsetTop)
		// console.log(thead.offsetTop+" --"+content_last.offsetTop)
	var dec= content_last.offsetTop-thead.offsetTop;   // 获取表格体的高度
		if(document.body.scrollTop>table.offsetTop){
			var top=table.offsetTop;
			flag=1;
			thead.className='trow fixed';
			temp.style.display='block';
			// if(document.body.scrollTop>content_last.offsetTop+150){  这里是用绝对距离，出错！！！！！
			// 	console.log('a')
			// 	thead.className='trow';
			// 	temp.style.display='none';   
			// }
			if(document.body.scrollTop-top>dec+80){//这里定位时不能用全局的document.body.scroll来计算，要相对于表格自身计算
		//这里的判断条件是指，当前表格头固定后，滚动条划过的距离大于该表格体的高度时，该表格的头消失。要计算相对距离
			
				thead.className='trow';
				temp.style.display='none';
			}

		}
		if(flag==1 && document.body.scrollTop<=table.offsetTop){
				thead.className='trow';
				temp.style.display='none';
				flag=0;
		}

	},false);

}





