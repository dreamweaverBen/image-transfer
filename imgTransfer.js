/**
 * Created by ben on 2018/8/30.
 */
var oOriginImg;             //原图片div对象
var oGrayImg;               //灰度图片div对象
var fileReader;             //fileReader对象
var oOriginImgWarn;         //警告对象p
var originImg;              //原图片对象
//var grayImg;                //灰度图片对象
var transferBtn;            //转换按钮对象
var oCanvas;                //画布对象
var context;                //画布上下文

window.onload = function () {
    oOriginImg = document.getElementById("originImg");
    oGrayImg = document.getElementById("grayImg");
    oOriginImgWarn = document.querySelector("#originImg .warn");
    originImg = document.querySelector("#originImg img");
    //grayImg = oGrayImg.querySelector("img");
    transferBtn = document.querySelector(".content-center button");
    oCanvas = document.createElement("canvas");
    context = oCanvas.getContext("2d");

    if(typeof FileReader !== "function" ){
        oOriginImgWarn.style.display = "block";
    }
    else{
        fileReader = new FileReader();    //实例化FileReader对象
        bindEvent();
        isDrag();
    }
};

//原图片框接受文件拖入
function isDrag() {
    oOriginImg.addEventListener("dragenter", function (event){
        event.preventDefault();
    });
    oOriginImg.addEventListener("dragover", function (event){
        event.preventDefault();
    });
    oOriginImg.addEventListener("drop", function (event){
        event.preventDefault();
        loadFile(event.dataTransfer.files);
    });
}

//绑定事件
function bindEvent() {
    fileReader.onload = function() {
        //console.log(fileReader.result);
        originImg.src = fileReader.result;
        originImg.style.display = "inline-block";
    };
    fileReader.onerror = function() {
        alert("读取文件失败");
        console.log(fileReader.error);
    };

    transferBtn.onclick = transfer;
    //按钮被点击后，三秒之内禁止连续点击
    transferBtn.addEventListener("click", function () {
        transferBtn.disabled = true;
        setTimeout(function() {
            transferBtn.disabled = false;
        }, 3000);
    });
}

//加载拖入的图片文件
function loadFile(files) {
    var file = files[0];
    if(files.length > 1){
        alert("只允许拖入一张图片！");
        return;
    }
    if(!/image\/\w+/.test(file.type)){
        alert("文件格式不正确！");
        return;
    }

    fileReader.readAsDataURL(file);
}

//图片转化
function transfer() {
    //如果原图片框没有图片
    if(originImg.style.display === "none"){
        alert("请选择图片！");
        return;
    }
    //从灰度图片框中删除canvas
    if(oCanvas.parentNode){
        oCanvas.parentNode.removeChild(oCanvas);
    }
    //获取原图片宽高
    var imageWidth = originImg.width;
    var imageHeight = originImg.height;
    //canvas中绘制图片
    oCanvas.width = imageWidth;
    oCanvas.height = imageHeight;
    context.drawImage(originImg, 0, 0, imageWidth, imageHeight);
    //获得图片像素信息
    var imgData = context.getImageData(0, 0, imageWidth, imageHeight);
    //进行灰度转化
    doTransfer(imgData);
    //将新的像素信息绘制在画布上
    context.putImageData(imgData, 0, 0);
    //将canvas添加到灰度图片框中
    oGrayImg.appendChild(oCanvas);
}
//操作图片像素进行转换
function doTransfer(imgData){
    var data = imgData.data,
        r = 0,
        g = 0,
        b = 0,
        alpha = 0,
        ave = 0,
        i = 0,
        len = data.length;
    for(;i < len; i += 4){
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        //alpha = data[i + 3];
        //取各像素颜色值的平均值，透明度不变
        ave = Math.ceil((r + g + b) / 3);
        data[i] = data[i + 1] = data[i + 2] = ave;
    }
}
