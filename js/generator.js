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
    var ctx = document.getElementById("table").getContext("2d")
    drawTable( ctx, [
      [
        "123456第一行 第二行 第三行",
        "123456這段有六個字",
        "123456這段是七個字喔",
        "123456這段文字有八個字",
        "123456這一段文字有九個字"
      ],
      [
        "123456六的兩倍十二六的兩倍十二f",
        "123456七的兩倍是十四七的兩倍是十四f",
        "123456八個的兩倍是十六八個的兩倍是十六f",
        "123456九的兩倍有足足十八九的兩倍有足足十八f",
        "123456第一行很少 第二行超過八個字會怎樣呢 還有第三行喔"
      ],
      [
        "123456第一行超過八個字會怎樣呢 第二行也超過八個子會怎樣呢"
      ]
    ]);
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
      arr.splice(10, 5);
      return callback(0, arr);
    }
  });
}

function rasis( context ) {
  context.save();
  {
    context.globalAlpha = 0.3;
    context.drawImage(document.getElementById('rasis'),0,40);
  }
  context.restore();
}

function drawTable( context, arr ) {
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
    context.strokeRect(0.5, 0.5, 479, 639);

    for (var i = 0; i < 5; i++) {
      context.beginPath();
      context.moveTo(30 + i*90 + 0.5, 0);
      context.lineTo(30 + i*90 + 0.5, 640);
      context.stroke();
    }

    for (var i = 0; i < 5; i++) {
      context.fillRect(0, 100 + i*120, 480, 60);
    }
  }
  context.restore();

  // text
  context.save();
  {
    context.textAlign = "center";

    context.fillStyle = "rgba(255, 255, 255, 0.8)";
    var week = ["一", "二", "三", "四", "五"];
    for (var i = 0; i < 5; i++) {
      context.fillText(week[i], 30 + 45 + 90*i, 25);
    }

    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    var clas = ["1", "2", "3", "4", "N", "5", "6", "7", "8", "9"]
    for (var i = 0; i < 10; i++) {
      context.fillText(clas[i], 15, 40 + 35 + i*60);
    }
  }
  context.restore();

  context.save();
  {
    context.textAlign = "center";
    context.fillStyle = "rgba(0, 0, 0, 0.9)";
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        wrapText (context, arr[i][j], 30 + 45 + 90*j, 40 + 15 + i*60, 80, 18);
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
