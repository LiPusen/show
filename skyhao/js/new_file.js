window.onload=function(){
	//图片加载
	var Oimg=eval('[{"name":1},{"name":2},{"name":3},{"name":4},{"name":5},{"name":6},{"name":7}]');
	anum();
	function anum(){
		for(var i=0; i<Oimg.length; i++){
			var html='<span><img src="img/'+Oimg[i].name+'.jpg"></span>';
			$(".con_box").append(html);
		}
		if(Oimg.length==1){
		$(".con_box span").addClass("one")
		}else if(Oimg.length==4){
			$(".con_box span").addClass("three");
		}else{
			console.log(Oimg.length)
			$(".con_box span").addClass("seve")
		}
		
	}
	//点赞
	$(".operation span").on("click",function(){
		var zan_num=parseInt($(this).text())
		if($(this).hasClass("zan")){
			zan_num--;
			$(this).text(zan_num);
			$(this).removeClass("zan")
		}else{
			zan_num++;
			$(this).text(zan_num);
			$(this).addClass("zan");
		}
	})
	//评论
	var Ol=eval('[{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"},{"name":"至尊宝","con":"有内涵~~~"}]');

	$(".text_con span").find("b").text(Ol.length);
	var len=Ol.length;
	var l=3;
	arr(len,l,$(".comments"));
	function arr(t,l,obj){
		if(t>=4){
			var Oli=Ol.slice(0,l);
			for(var i=0; i<Oli.length; i++){
				var html='<li><p><i>'+Ol[i].name+'</i>：<em>'+Ol[i].con+'</em></p></li>';
				obj.append(html);
			}
		}else{
				return;
			}
	}
	
	$(".text_con").on("click",function(){
		var Oem=$(this).find("em"),
			Osapn=$(this).find("sapn"),
			Ocom=$(this).siblings(".comments");
		if(Oem.hasClass('up')){
			Ocom.html('');
			arr(len,3,Ocom);
			Oem.removeClass(' up').siblings("span").html('查看全部'+len+'评论')
		}else{
			arr(len,len-l,Ocom);
			Oem.addClass(' up').siblings("span").text("收起")
		}
	})
}
