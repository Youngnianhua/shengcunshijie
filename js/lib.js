//requestAnimationFrame
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
//requestAnimationFrame
function bindAnimation(foo){
    return function(){
        var dt_old = 0;
        return function(dt){
            if(!dt_old)dt_old = dt - 1000/30;
            var step = dt - dt_old;
            dt_old = dt;
            foo(step);
        }
    }
}
//御用库函数
function addTo(obj,add){
    for(var attr in add){
        if(obj[attr]){
            obj[attr] += add[attr];
        }else{
            obj[attr] = add[attr];
        }
    }
}
function together(a,b){
    var result = clone(a);
    var add = clone(b);
    for(var attr in add){
        if(result[attr]){
            result[attr] += add[attr];
        }else{
            result[attr] = add[attr];
        }
    }
    return result;
}
function getLength(obj){
    //计算对象中成员属性的数量
    var count = 0;
    for (var attr in obj) {
        count ++;
    };
    return count;
}
function getRandomThing(things) {
    var num = 0;
    for (var attr in things) {
        num += things[attr].amount == undefined ? things[attr] : things[attr].amount;
    };
    var total = num;
    num = Math.ceil(Math.random()*num);
    var flag = false;
    for (var attr in things) {
        num -= things[attr].amount == undefined ? things[attr] : things[attr].amount;
        if(num <= 0){
            flag = true;
            break;
        }
    };
    if(flag == false || total == 0){
        return {attr:false,total:total};
    }
    return {attr:attr,total:total};
};
function getRandom(obj,props){
    var count = 0;
    for (var attr in obj) {
        if(props && props.noAttr){
            if(obj[attr][props.noAttr])continue;
        }
        if(props && props.haveValue){
            if(obj[attr][props.haveValue[0]] != props.haveValue[1])continue;
        }
        count ++;
    };
    var length = Math.random()*count;

    count = 0;
    for (var attr in obj) {
        if(props && props.noAttr){
            if(obj[attr][props.noAttr])continue;
        }
        if(props && props.haveValue){
            if(obj[attr][props.haveValue[0]] != props.haveValue[1])continue;
        }
        count ++;
        if(count >= length){
            return {attr:attr,value:obj[attr]};
        }
    };
    return false;
}
function clone(obj){
    //克隆一个对象
    var o;  
    switch(typeof obj){  
    case 'undefined': break;  
    case 'string'   : o = obj + '';break;  
    case 'number'   : o = obj - 0;break;  
    case 'boolean'  : o = obj;break;  
    case 'object'   :  
        if(obj === null){  
            o = null;  
        }else{  
            if(obj instanceof Array){  
                o = [];  
                for(var i = 0, len = obj.length; i < len; i++){  
                    o.push(clone(obj[i]));  
                }  
            }else{  
                o = {};  
                for(var k in obj){  
                    o[k] = clone(obj[k]);  
                }  
            }  
        }  
        break;  
    default:          
        o = obj;break;  
    }  
    return o; 
}
function cloneMul(obj,mul,isRound){
    //克隆一个容器内的物品，并倍乘一个数
    var o = {};
    var mul = mul||1;
    for (var attr in obj) {
        var num = mul * obj[attr];
        o[attr] = isRound?Math.round(num):num;
    };
    return o;
}
function o(attr,value){
    var o = {};
    o[attr] = value;
    return o;
}
function lll(value){
    console.log(value);
}
function getFirst(obj){
    for(var attr in obj){
        return {attr:attr,value:obj[attr]}
    }
}
function loadFile(filename,filetype){
    if(filetype == "js"){
        var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src",filename);
    }else if(filetype == "css"){
        var fileref = document.createElement('link');
        fileref.setAttribute("rel","stylesheet");
        fileref.setAttribute("type","text/css");
        fileref.setAttribute("href",filename);
    }
   if(typeof fileref != "undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}
//合并两个json对象
function extend(target, source) {
    for (var obj in source) {
        target[obj] = source[obj];
    }
    return target;
}
//字符串转bool
String.prototype.bool = function() { 
    return (/^true$/i).test(this); 
};
//js下载文件
function exportRaw(data, name) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    save_link.click();
    $('.dc').css('display','block');
    setTimeout(function (){
        $('.dc').fadeOut(500);
    }, 2000);
}
//js 读取文件
function jsReadFiles(files) {
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();
        if (/text+/.test(file.type)) {
            reader.onload = function() {
                var data = JSON.parse(this.result);
                localStorage.setItem('number',(data.number==''||data.number==null||data.number==undefined)?1:data.number);
                localStorage.setItem('sort',(data.sort==''||data.sort==null||data.sort==undefined)?false:data.sort);
                localStorage.setItem('autoSave',(data.autoSave==''||data.autoSave==null||data.autoSave==undefined)?false:data.autoSave);
                localStorage.setItem('saveData1',(data.saveData1==''||data.saveData1==null||data.saveData1==undefined)?'':data.saveData1);
                localStorage.setItem('saveData2',(data.saveData2==''||data.saveData2==null||data.saveData2==undefined)?'':data.saveData2);
                localStorage.setItem('saveData3',(data.saveData3==''||data.saveData3==null||data.saveData3==undefined)?'':data.saveData3);
                localStorage.setItem('saveData4',(data.saveData4==''||data.saveData4==null||data.saveData4==undefined)?'':data.saveData4);
                localStorage.setItem('saveData5',(data.saveData5==''||data.saveData5==null||data.saveData5==undefined)?'':data.saveData5);
                $('.dr').css('display','block');
                location.reload();
            }
            reader.readAsText(file);
        }
    }else{

    }
}
;(function(){
    //CDN获取JS失败时
    if (!window.jQuery){
        loadFile("./build/jquery.js","js");
    }
    if (!window.React){
        loadFile("./build/react-with-addons.js");
        loadFile("./build/react-dom.js");
        loadFile("./build/browser.min.js");
    }
})();