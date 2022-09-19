/***
 * 作者：FANCC
 * 时间：2022年9月18日
 * 版本1.4.1
 * 本版本更新：模糊匹配关键词 中文查词
 * 
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
let pronounce_close = {
    "a": ["e"],
    "e": ["a", "i"],
    "i": ["e"],
    "z": ["s"],
    "s": ["z"],
    "i": ["y"],
    "y": ["i"],
    "g": ["k"],
    "b": ["p"],
    "n": ["m"],
    "m": ["n"]
}
// 加载字库
function load_json(){
    let ck = document.querySelector("#ck").value;
    if (ck === ""){
        return;
    }
    wdict = {};
    out_text("词库加载中...请耐心等待");
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
            out_text("词库不存在");
        };
    }, 0);
}
// 字库定位
function loadWords(){
    if (response["dictionary"] === undefined){
        out_text("词库已损坏");
        return
    }
    let counter = 0;
    for (let wjnum=0;wjnum < response['dictionary'].length; wjnum++){
        let wrd = response['dictionary'][wjnum]['headWord'];
        wdict[wrd] = wjnum;
        counter++;
    }
    out_text("词库加载完毕-"+response["dictionary"][0]["bookId"]+"词库词数"+String(counter));
    stat = true;
}
// 查询
function search(){
    if (!stat){
        if (out.innerText === ""){
            out_text("请先加载词库");
        }
        return;
    }
    if (document.getElementsByName("mode")[0].checked){
        search_by_en();
    }else{
        search_by_cn();
    }
}
function search_by_en(){
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
        out_html(op);
    }else{
        blur_search();
    }
}
function blur_search(){
    let s = document.querySelector("#in").value;
    let results = [];
    for (let w in wdict){
        let result = {};
        result.word = w;
        let clo = 1;
        for (let x=0;x<Math.min(w.length, s.length);x++){
            if (Math.abs(w.length - s.length) > 3){
                clo *= 0;
                break;
            }
            if (x === 0 && w[x] !== s[x]){
                clo *= 0;
                break;
            }
            clo *= w[x] === s[x] ? 1 : p_close_check(s[x], w[x]);
        }
        result.clo = clo;
        results.push(result);
    }
    results = results.sort(function(a, b){
        return b.clo - a.clo;
    }).splice(0,10);
    if (results[0].clo <= 0.25){
        out_text("查无此词");
        return
    }
    let o = "你可能要搜的词?<br>";
    for (let r=0;r<results.length;r++){
        o += results[r].word;
        o += "<br>";
    }
    out_html(o);
}
function p_close_check(s, w){
    if (pronounce_close[s] !== undefined){
        if (pronounce_close[s].includes(w)){
            return 0.8;
        }
        return 0.5;
    }else{
        return 0.5;
    }
}
function search_by_cn(){
    let s = document.querySelector("#in").value;
    if (s === ""){
        return
    }
    let en_dict = [];
    for (let count = 0;count < response.dictionary.length;count++){
        if (shiyi(response['dictionary'][count]['content']['word']['content']['trans']).indexOf(s) > -1){
            en_dict.push(response['dictionary'][count]['headWord']);
        }
    }
    en_dict = en_dict.splice(0, 10);
    if (en_dict.length === 0){
        out_text("没有与之对应的英文词汇");
        return
    }
    out_html("可能中文释义与之相对的是如下词汇<br>"+en_dict.join("<br>"));
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
function out_text(text){
    out.innerText = text;
}
function out_html(text){
    out.innerHTML = text;
}
