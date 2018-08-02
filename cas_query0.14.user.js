// ==UserScript==
// @name         infsic
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       You
// @match        http*://*/*
// @require      https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

$(document).ready(function(){
    function page_after_check(cas_arr){
        // 添加样式
        var styleStr = `
body,div,a,p,span{
margin: 0;
padding:0;
}
.shadeinf{
width: 100%;
height: 100%;
background: rgba(0,0,0,.5);
position: absolute;
z-index: 1;
display: none;
}
.logininf{
padding:10px;
border-radius: 10px;
border: 2px solid #ccc;
width: auto;
height: auto;
background: #fff;
position: absolute;
z-index: 2;
display: none;
}

.titleinf{
border-bottom: 1px #ccc solid;
text-align: center;
font-weight: bold;
padding:5px 0 10px 0;
}
table,table tr th, table tr td {
border:1px solid;
}
table {
width: auto; min-height: 25px; line-height: 25px; text-align: center; border-collapse: collapse;
}
#btninfclose{
margin-top: 5px;
float: left;
}
`;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styleStr;
        document.getElementsByTagName('HEAD').item(0).appendChild(style);

        // 2.遍历CAS号，添加按钮
        $.each(cas_arr, function(key,value){
            //alert("arr :" + key + '-' + value);
            $("body :contains(" + value + ")").parent().append( '<button ' + 'value="' + value + '" class="btninf">'+value+'</button>');
        });

        // 插入模态框
        $("body").append('<div class="shadeinf"></div><div class="logininf"><p class="titleinf">弹出标题</p><p class="continf">弹出内容</p><button type="button" class="btninfclose">关闭</button></div>');
        $(function(){
            //浏览器大小发生改变
            $(window).resize(function(){
                showShade();
            });

            //模态框出现
            $(".btninf").bind("click",function(){
                $(".shadeinf").fadeIn(100);
                $(".logininf").fadeIn(100);
                //$(this).css("display","none");
                showShade();
            });
            //点击span关闭
            $(".btninfclose").bind("click",function(){
                $(".shadeinf").fadeOut(100);
                $(".logininf").fadeOut(100);
            });

            //居中显示
            function showShade(){
                var top = ($(window).height() - $(".logininf").height())/2;
                var left = ($(window).width() - $(".logininf").width())/2;
                var scrollTop = $(document).scrollTop();
                var scrollLeft = $(document).scrollLeft();
                $(".logininf").css( { position : 'absolute', 'top' : top + scrollTop, left : left + scrollLeft } ).show();
            }

            //绑定键盘事件  按下esc键退出
            $(document).keyup(function(ev){
                //                alert(ev.keyCode);  获取esc的键码27
                if(ev.keyCode == 27){
                    //                    $("span").click();
                    //模拟事件
                    $(".btninfclose").trigger("click");
                }
            });
        });
        // 3.添加按钮点击事件
        $('.btninf').on('click', function() {
            var cas_num = $(this).attr("value");
            // 修改模态框标题
            $(".titleinf").text("CAS : "+cas_num);
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
                    $(".continf").html(html_str);
                }
            });
        });
        // 隐藏悬浮窗
        $('.toolbar').hide();
    }
	
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
    var cas_arr = cas_strs.match(/\d{2,6}-\d\d-\d/g);
    console.log(cas_arr);
    if(cas_arr === null){
        console.log("cas_arr is null");
        $("body").append("<button id='scriptreloadinf'>重新加载工具</button>");
        // 重新加载脚本按钮事件
        console.log("123");
        $('#scriptreloadinf').on('click', function(){
            console.log("script reload!");
			var cas_strs = $("body").text();
			var cas_arr = cas_strs.match(/\d{2,6}-\d\d-\d/g);
			$(".btninf").remove()；
            page_after_check(cas_arr.unique3());
        });
        console.log("456");
    }
    else{
        cas_arr = cas_arr.unique3();
        console.log(cas_arr);
        page_after_check(cas_arr);
    }

});
