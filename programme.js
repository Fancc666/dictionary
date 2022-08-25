let response;
let wdict = {};
let out = document.querySelector("#out");
function load_json(){
    let ck = document.querySelector("#ck").value;
    if (ck === ""){
        return;
    }
    wdict = {};
    out.innerText = "词库加载完毕";
    setTimeout(function(){
        let s = document.createElement("script");
        s.src = "./"+ck;
        document.querySelector("body").appendChild(s);
        s.onload = function(){
            console.log("dict-ok");
            loadWords();
            out.innerText = "词库加载完毕";
        };
        s.onerror = function(){
            alert("缺失词库文件");
        };
    }, 0);
}
function loadWords(){
    for (let wjnum=0;wjnum < response['dictionary'].length; wjnum++){
        let wrd = response['dictionary'][wjnum]['headWord'];
        wdict[wrd] = wjnum;
    }
}
function search(){
    if (!Object.keys(wdict).length){
        out.innerText = "未加载词库";
        return;
    }
    let s = document.querySelector("#in").value;
    if (wdict[s]){
        let op = "";
        op += "释义<br>";
        op += JSON.stringify(response['dictionary'][wdict[s]]['content']['word']['content']['trans'])+"<br><br>";
        op += "例句<br>";
        op += JSON.stringify(response['dictionary'][wdict[s]]['content']['word']['content']['sentense'])+"<br><br>";
        op += "短语<br>";
        op += JSON.stringify(response['dictionary'][wdict[s]]['content']['word']['content']['phrase'])+"<br><br>";
        op += "源文件<br>";
        op += JSON.stringify(response['dictionary'][wdict[s]])+"<br><br>";
        out.innerHTML = op;
    }else{
        out.innerText = "查无此词";
    }
}
