
var para={
		start_year:2000,
		end_year:2020,
		input:'input',  //获取的数据返回位置id
		handler:function(){
			alert('选择完成！');
		},
		period:[true,2,30,'/'] 
	};

document.getElementById('input').onclick=function(e){
	Calendar.create(para,'div1');   //接受第二个参数，表示容器
	e.stopPropagation();
}


