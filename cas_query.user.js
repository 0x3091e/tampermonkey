// ==UserScript==
// @name         infsic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

$(document).ready(function(){
    // 数组去重
	Array.prototype.unique3 = function(){
		 var res = [];
		 var json = {};
		 for(var i = 0; i < this.length; i++){
			if(!json[this[i]]){
			 res.push(this[i]);
			 json[this[i]] = 1;
			}
		 }
		 return res;
	};
    // 1.获取CAS号
    var cas_strs = $("body").text();
    //console.log(cas_strs);
    var cas_arr = cas_strs.match(/\d{2,5}-\d\d-\d/g);
    console.log(cas_arr);
	cas_arr = cas_arr.unique3();
	console.log(cas_arr);

	// 2.遍历CAS号，添加按钮
	$.each(cas_arr, function(key,value){
		//alert("arr :" + key + '-' + value);
		$("body :contains(" + value + ")").parent().append('<button ' + 'value="' + value + '" class="infclass" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>'+value+'</button>');
	});

    // 插入模态框
	$("body").append('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="myModalLabel">模态框（Modal）标题</h4></div><div class="modal-body">按下 ESC 按钮退出。</div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button></div></div></div></div>');
    // 3.添加按钮点击事件
    $('.infclass').on('click', function() {
        var cas_num = $(this).attr("value");
		// 修改模态框标题
		$("#myModalLabel").text("CAS : "+cas_num);
        //cas_num = '109-72-8';
		// 4.调用接口获取数据
		GM_xmlhttpRequest({
			method : "GET",
			headers: {"Accept": "application/json"},
			url : "http://www.taomole.com/product_ln/price_grid_cas/"+cas_num+"/",
			onload : function (response) {
				console.log("http://www.taomole.com/product_ln/price_grid_cas/"+cas_num+"/");
				//console.log(response.responseText);
				html_str = response.responseText;
                //alert(html_str);
                html_str = html_str.replace(/\s+/g,' '); // 格式化
                //alert(html_str);
				// 5.修改模态框内容
				$(".modal-body").html(html_str);
			}
		});
    });
    // 隐藏悬浮窗
    $('.toolbar').hide();
});
