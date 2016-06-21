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

}

Table.prototype={

	init:function(cfg){
	//参数合并
		var set={};
			for (var i in this.defaults){
		 		set[i] = cfg[i] ? cfg[i] : this.defaults[i];
			}	
		var table=createTable(table,set);
		//固定表单头
		if(set.table_head_fixed){
			headFixed(table);
		}

		return table;
	}
}


//创建表单

function createTable(table,set){
	// table_head
	var table=document.createElement('table');

	tableHead(table,set);	
	//table_content
	tableContent(table,set,set.table_content);

	return table;
};


function tableHead(table,set){
	var t_head=document.createElement('tr');
		
		t_head.className='trow';
		for (var i=0; i<set.table_col; i++){

			var th=document.createElement('th');

			th.className='tdata';
			th.setAttribute('col_th',i);   //标记所有列的列数，方便后边取用
			th.innerHTML=set.table_head[i];

			var sort_icon=document.createElement('div');
			sort_icon.className='sort_icon';
			sort_icon.innerHTML='<img src="table_plugin/sort35.png" /><span class="up"></span><span class="down"></span>';
				
			if(set.col_sort[i]){
				sort_icon.style.display='block';
			}

			th.appendChild(sort_icon);
			t_head.appendChild(th);	

			//绑定排序事件
			var up=sort_icon.getElementsByTagName('span')[0];
			var down=sort_icon.getElementsByTagName('span')[1];
			up.addEventListener('click',function(event){

				Sorting(event,table,set);

			},false);
			down.addEventListener('click',function(event){

				Sorting(event,table,set);

			},false);
		}

	table.appendChild(t_head);


}

function tableContent(table,set,data){

	for (var i=0; i<set.table_row; i++){
			var tr=document.createElement('tr');
				tr.className='trow';
				tr.setAttribute('row_th',i);  //标记除表单头之外的行的行数，方便后边取用
			var td="";
			for(var j=0; j<set.table_col; j++){
				td+='<td class="tdata">'+data[i+1][j]+'</td>';
			}
			tr.innerHTML=td;
			table.appendChild(tr);
		}
}


//表单排序 
	function Sorting(event,table,set){

		var event=event || window.event;
		var eventTarget=event.target || event.srcElement;
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
	var content_0=table.getElementsByTagName('tr')[1];
	var content_last=table.getElementsByTagName('tr')[table.getElementsByTagName('tr').length-1]
	var temp=document.createElement('div');
	var flag=0;
		temp.className='thead_temp';
		table.insertBefore(temp,content_0);
	window.addEventListener('scroll',function(event){
// console.log(document.body.scrollTop-table.offsetTop)

		if(document.body.scrollTop>table.offsetTop){
			flag=1;
			thead.className='trow fixed';
			temp.style.display='block';
		}
		if(flag==1 && document.body.scrollTop<=table.offsetTop){
				thead.className='trow';
				temp.style.display='none';
		}
		if(flag==1 && document.body.scrollTop>content_last.offsetTop+150){
				// thead.className='trow';
				// temp.style.display='none';	
		}


	},false);

}





		// for (var i=0;i<set.table_row;i++){
		// 	for (var j=0;j<=i;j++){

		// 		if(sort_type=='up'){
		// 			if(rows_value[i]<rows_value[j]){
		// 				for (var k=0;k<set.table_col;k++){
		// 					var temp =rows_value[i];
		// 						rows_value[i]=rows_value[j];
		// 						rows_value[j]=temp;
		// 					var temp=table.rows[i+1].cells[k].innerText;
		// 					table.rows[i+1].cells[k].innerText=table.rows[j+1].cells[k].innerText;
		// 					table.rows[j+1].cells[k].innerText=temp;
		// 				}
		// 			}
		// 		}
		// 		if(sort_type=='down'){
		// 			if(rows_value[i]>rows_value[j]){
		// 				for (var k=0;k<set.table_col;k++){
		// 					var temp =rows_value[i];
		// 						rows_value[i]=rows_value[j];
		// 						rows_value[j]=temp;
		// 					var temp=table.rows[i+1].cells[k].innerText;
		// 					table.rows[i+1].cells[k].innerText=table.rows[j+1].cells[k].innerText;
		// 					table.rows[j+1].cells[k].innerText=temp;
		// 				}
		// 			}
		// 		}
		// 	}
		// }

//问题
//当有函数event和参数两个要传的时，该如何传参
// 获取某列的所有行
// 排序用array.sort(fucntion(a,b){
// 	 return a-b;
// }) 时，如何交换一行中所有的值

// 总结

 // (1)table取行列的值 table.rows[n].cells[m]
 // (2)获取事件对像 event.target || event.srcElement

// css 选择器：ID class 标签 兄弟 ＋ ~ >  ' '  伪类／伪元素
// 	优先级：行内=1000 id＝100 class/属性＝10  伪元素／标签＝1  ！importent；
// 	清除浮动 clearfix 




