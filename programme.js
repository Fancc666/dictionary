/***
 * 作者：FANCC
 * 时间：2022年8月25日
 * 版本1.3.3
 * 字典程序部分
 * 离线版本需要字库，默认自带专八z8.json字库和高中词汇gz.json
 * 新建字库结构应当同https://github.com/kajweb/dict 的json字库
 * 你可以直接下载github上的字库(上面的链接)，也可以自己做，可以根据下方程序省去冗余结构
 * 字库在使用前请编辑fh.py并执行(请先安装python)
 * 有不明白的地方请发送问题直接问我fancc@565455.xyz
 * 
 * 转载不需要告诉我随便用就好，如果你愿意添上我的名字FANCC我会很高兴
 * 开源https://github.com/Fancc666/dictionary
 */
let response = {};
let wdict = {};
let out = document.querySelector("#out");
let stat = false;
let debug = false;
// 加载字库
function load_json(){
    let ck = document.querySelector("#ck").value;
    if (ck === ""){
        return;
    }
    wdict = {};
    out.innerText = "词库加载中...请耐心等待";
    stat = false;
    setTimeout(function(){
        let s = document.createElement("script");
        s.src = "./"+ck;
        document.querySelector("body").appendChild(s);
        s.onload = function(){
            s.remove();
            console.log("dict-ok");
            loadWords();
        };
        s.onerror = function(){
            s.remove();
            out.innerText = "词库不存在";
        };
    }, 0);
}
// 字库定位
function loadWords(){
    if (response["dictionary"] === undefined){
        out.innerText = "词库已损坏";
        return
    }
    let counter = 0;
    for (let wjnum=0;wjnum < response['dictionary'].length; wjnum++){
        let wrd = response['dictionary'][wjnum]['headWord'];
        wdict[wrd] = wjnum;
        counter++;
    }
    out.innerText = "词库加载完毕-"+response["dictionary"][0]["bookId"]+"词库词数"+String(counter);
    stat = true;
}
// 查询
function search(){
    if (!stat){
        if (out.innerText === ""){
            out.innerText = "请先加载词库";
        }
        return;
    }
    let s = document.querySelector("#in").value;
    if (wdict[s] !== undefined){
        let op = "";
        op += "释义<br>";
        op += shiyi(response['dictionary'][wdict[s]]['content']['word']['content']['trans'])+"<br><br>";
        op += "读音<br>";
        op += duyin(response['dictionary'][wdict[s]]['content']['word']['content'])+"<br><br>";
        op += "例句<br>";
        op += liju(response['dictionary'][wdict[s]]['content']['word']['content']['sentence'])+"<br><br>";
        op += "短语<br>";
        op += duanyu(response['dictionary'][wdict[s]]['content']['word']['content']['phrase'])+"<br><br>";
        if (debug){
            op += "源文件<br>";
            op += JSON.stringify(response['dictionary'][wdict[s]]);
        }
        out.innerHTML = op;
    }else{
        out.innerText = "查无此词";
    }
}
// 其他方法
// 格式化 释义，读音，例句，短语
function shiyi(i){
    let r = "";
    for (let x=0;x<i.length;x++){
        r += i[x]['pos'] + ".";
        r += i[x]['tranCn'];
        if (i[x]['tranOther'] !== undefined){
            r += "(" + i[x]['tranOther'] + ")";
        }
        r += ";";
        if (x !== i.length - 1){
            r += "<br>";
        }
    }
    return r;
}
function duyin(i){
    i = i['phone'] || i["usphone"];
    if (i === undefined){
        return "未记录";
    }
    return "/"+i+"/";
}
function liju(i){
    if (i === undefined){
        return "未记录";
    }
    i = i['sentences'];
    let r = "";
    for (let x=0;x<i.length;x++){
        r += i[x]['sContent'];
        r += i[x]['sCn'];
        if (x !== i.length - 1){
            r += "<br>";
        }
    }
    return r;
}
function duanyu(i){
    if (i === undefined){
        return "未记录";
    }
    i = i['phrases'];
    let r = "";
    for (let x=0;x<i.length;x++){
        r += i[x]['pContent'];
        r += i[x]['pCn'];
        if (x !== i.length - 1){
            r += "<br>";
        }
    }
    return r;
}
