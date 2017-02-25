var url = "https://ncku-classtable-parser.herokuapp.com/";
//var url = "http://dcie.ddns.net:3000/";

(function ($) {

  $.ajax({
    method: "POST",
    url: url,
    dataType: "json",
    data: { stu_no: "", passwd: "", room: false }
  }).done(function(d) {
    $("#status").text("●").attr('color', 'green');
  }).fail(function(e) {
    $("#status").text("●").attr('color', 'red');
  });

  if (false) {
    $("#canvas-container").fadeIn("slow");
    var canvas = document.getElementById("table");
    var ctx = canvas.getContext("2d");
    var option = {
      width: 480,
      height: 640,
      more: true,
    }
    drawTable( canvas, ctx, [
      [
        {course_no:"AA-000", text:"123456第一行 第二行 第三行"},
        {course_no:"AA-000", text:"123456這段有六個字"},
        {course_no:"AA-000", text:"123456這段是七個字喔"},
        {course_no:"AA-000", text:"123456這段文字有八個字"},
        {course_no:"AA-000", text:"123456這一段文字有九個字"}
      ],
      [
        {course_no:"AA-000", text:"123456六的兩倍十二六的兩倍十二f"},
        {course_no:"AA-000", text:"123456七的兩倍是十四七的兩倍是十四f"},
        {course_no:"AA-000", text:"123456八個的兩倍是十六八個的兩倍是十六f"},
        {course_no:"AA-000", text:"123456九的兩倍有足足十八九的兩倍有足足十八f"},
        {course_no:"AA-000", text:"123456第一行很少 第二行超過八個字會怎樣呢 還有第三行喔"}
      ],
      [
        {course_no:"AA-000", text: "123456第一行超過八個字會怎樣呢 第二行也超過八個子會怎樣呢"}
      ]
    ], option);
    $("#loading-gif").hide();
    $("#canvas-container").fadeIn("slow");
    $("#hint").fadeIn("slow");
    return;
  }

})(jQuery);

function getTable(stn_no, passwd, room, callback) {
  $.ajax({
    method: "POST",
    url: url,
    dataType: "json",
    data: { stu_no: stn_no, passwd: passwd, room: room }
  }).done(function(data) {
    var arr = JSON.parse(data)
    if (arr.err) {
      return callback(-1, arr.err);
    } else {
      arr.splice(0, 2);
      return callback(0, arr);
    }
  });
}

function rasis( canvas, context ) {
  context.save();
  {
    context.globalAlpha = 0.3;
    context.drawImage(document.getElementById('rasis'),0,40,canvas.width,canvas.height-40);
  }
  context.restore();
}

function img( canvas, context, url ) {
  var img = new Image;
  img.onload = function(){
    context.save();
    {
      context.globalAlpha = 0.3;
      context.drawImage(img,0,40,canvas.width,canvas.height-40);
    }
    context.restore();
  };
  img.src = url;
}

function drawTable( canvas, context, arr, option ) {
  var week = ["一", "二", "三", "四", "五"];
  var clas = ["1", "2", "3", "4", "N", "5", "6", "7", "8", "9"];
  if(option.more) clas = clas.concat(["A", "B", "C", "E"]);
  var eleWidth = option.eleWidth? option.eleHeight: 90;
  var eleHeight = option.eleHeight? option.eleHeight: 60;
  var headerWidth = 30;
  var headerHeight = 40;
  var width = eleWidth*week.length + headerWidth;
  var height = eleHeight*clas.length + headerHeight;

  canvas.width  = width;
  canvas.height = height;

  // header bar
  context.save();
  {
    context.shadowOffsetY = 2;
    context.shadowBlur = 2;
    context.shadowColor = "rgba(0, 0, 0, 0.4)";
    context.fillStyle = "rgba(38, 166, 154, .9)";
    context.fillRect(0, 0, 480, 40);
  }
  context.restore();

  // grid
  context.save();
  {
    context.strokeStyle = "rgba(0, 0, 0, 0.2)";
    context.fillStyle = "rgba(0, 0, 0, 0.1)";
    context.strokeRect(0.5, 0.5, width-1, height-1);

    for (var i = 0; i < week.length; i++) {
      context.beginPath();
      context.moveTo(30 + i*eleWidth + 0.5, 0);
      context.lineTo(30 + i*eleWidth + 0.5, height);
      context.stroke();
    }

    for (var i = 0; i < clas.length/2; i++) {
      context.fillRect(0, 40 + eleHeight + i*eleHeight*2, width, eleHeight);
    }
  }
  context.restore();

  // text
  context.save();
  {
    context.textAlign = "center";

    context.fillStyle = "rgba(255, 255, 255, 0.8)";
    for (var i = 0; i < week.length; i++) {
      context.fillText(week[i], 30 + 45 + i*eleWidth, 25);
    }

    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    for (var i = 0; i < clas.length; i++) {
      context.fillText(clas[i], 15, 40 + eleHeight/2 + 5 + i*eleHeight);
    }
  }
  context.restore();

  context.save();
  {
    context.textAlign = "center";
    context.fillStyle = "rgba(0, 0, 0, 0.9)";
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        wrapText (context, arr[i][j], headerWidth + eleWidth/2 + j*eleWidth, headerHeight + eleHeight/4 + i*eleHeight, eleWidth-10, 18);
      }
    }
  }
  context.restore();
}

function clear( canvas, context ) {
  context.save();
  {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.restore();
}

function wrapText (context, course, x, y, maxWidth, lineHeight) {

  var course_no = course.course_no;
  var text = course.text;
  var room = course.room;
  var sp = text.split(/ |<br>|<\/br>/g);
  var line = [];

  if ( sp.length == 1) {
    sp = sp[0];
    if (sp.length > 8 && sp.length < 12) {
      line.push( sp.slice(0, 6) );
      line.push( sp.slice(6) );
    } else if (sp.length >= 12) {
      line.push( sp.slice(0, sp.length/2) );
      line.push( sp.slice(sp.length/2) );
    } else {
      line.push( sp );
    }
  } else {
    line = sp;
  }

  if (typeof room == "undefined") {
    context.fillText(course_no, x, y, maxWidth);
    y += lineHeight;
  }

  for (var i = 0; i < 2; i++) {
    if ( typeof line[i] == 'undefined' ) break;
    context.fillText(line[i], x, y, maxWidth);
    y += lineHeight;
  }

  if (typeof room != "undefined") {
    context.fillText(room, x, y, maxWidth);
    y += lineHeight;
  }

}
