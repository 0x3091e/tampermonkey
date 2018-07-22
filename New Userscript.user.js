// ==UserScript==
// @name         hello,world
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://movie.douban.com/subject/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        GM_xmlhttpRequest
// @connect      http://api.jirengu.com/*
// ==/UserScript==

$(document).ready(function(){
    var title = $('h1').text();
    console.log(title);
    var rp = $(".ratings-on-weight .rating_per").text();
    console.log(rp);
    $(".ratings-on-weight .rating_per").each(function(){
        //console.log("123");
        //alert($(this).text());
    });
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {"Accept": "application/json"},
        url : "http://api.jirengu.com/getWeather.php?city=北京",
        onload : function (response) {
            //console.log("123");
            //alert(response.responseText);
            json_str = response.responseText;
            json_obj = jQuery.parseJSON(json_str);
            //console.log(json_str);
            //console.log(json_obj.results);
            //console.log(json_obj.results[0]);
            console.log(json_obj.results[0].currentCity); // 城市
            city = json_obj.results[0].currentCity;
            console.log(json_obj.results[0].weather_data[0].weather); // 天气
            weather = json_obj.results[0].weather_data[0].weather;
            console.log(json_obj.results[0].weather_data[0].wind); // 风
            wind = json_obj.results[0].weather_data[0].wind;
            console.log(json_obj.results[0].weather_data[0].temperature); // 温度
            temperature = json_obj.results[0].weather_data[0].temperature;
            
            //获取插入位置
            insert_pos = $("h1");
            //拼接数据
            insert_html_str = "<b>" + city + "," + weather + "," + wind + "," + temperature + "</b>";
            console.log(insert_html_str);
            //插入数据
            insert_pos.append(insert_html_str);
        }
    });
});
