function getTable(stn_no, passwd, callback) {
  $.ajax({
    method: "POST",
    url: "https://ncku-classtable-parser.herokuapp.com/",
    dataType: "json",
    data: { stu_no: stn_no, passwd: passwd }
  }).done(function(data) {
    var arr = JSON.parse(data)
    if (arr.err) {
      return callback(0);
    } else {
      arr.splice(0, 2);
      arr.splice(10, 5);
      return callback(arr);
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
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function wrapText (context, text, x, y, maxWidth, lineHeight) {

  var course_no = text.slice(0, 6);
  var text = text.slice(6);
  var sp = text.split(/ |<br>|<\/br>/g);
  var line = [];

  for (var i = 0; i < sp.length; i++) {
    if (sp[i].length > 8 && sp[i].length < 12) {
      line.push( sp[i].slice(0, 6) );
      line.push( sp[i].slice(6) );
    } else if (sp[i].length > 12) {
      line.push( sp[i].slice(0, 8) );
      line.push( sp[i].slice(8) );
    } else {
      line.push( sp[i] );
    }
  }

  context.fillText(course_no, x, y, maxWidth);
  y += lineHeight;

  for (var i = 0; i < 2; i++) {
    context.fillText(line[i], x, y, maxWidth);
    y += lineHeight;
  }

}
