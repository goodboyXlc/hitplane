// 开始界面
var startdiv = document.getElementById("startdiv");

//游戏主界面
var maindiv = document.getElementById("maindiv");

//分数
var label = document.getElementById("label");

//最终的分数
var planscore = document.getElementById("planscore");

//结束页面
var enddiv = document.getElementById("enddiv");


//定时器
var tid;

//统计分数
var scores = 0;

// function test() {
// }

//保存敌方飞机的数组
var enemys = [];

//保存子弹的数组
var bullets = [];

var time1 = 0;
var time2 = 0;

// 开始游戏的按钮事件
function begin() {
  //alert("hehe");
  startdiv.style.display = "none";
  maindiv.style.display = "block";

  tid = setInterval(start,30);
}

//重新开始
function chongxin() {
  window.location.reload(true);
}


var positionY = 0;   //背景流动的临时变量

//循环调用的方法
function start() {

  //背景图片的流动(不支持 FirFox
  maindiv.style.backgroundPositionY = positionY + "px";
  positionY += 0.9;
  if(positionY == 568) {
    positionY = 0;
  }

  //enemys.push(new enemy());
  time1++;   //1 2 3 ....20   0

  if(time1 == 20) {
    time2++;    //1
    if(time2%5 == 0) {   //创建中型飞机
      enemys.push(new enemy(25,282,46,64,'image/enemy3_fly_1.png',3,"image/中飞机爆炸.gif",5,360,500));
    }

    if(time2 == 20) {   //创建大型飞机
      enemys.push(new enemy(57,216,110,170,'image/enemy2_fly_1.png',1,"image/大飞机爆炸.gif",20,600,1000));
      time2 = 0;
    }

    else {
      enemys.push(new enemy(5,285,34,24,'image/enemy1_fly_1.png',4,"image/小飞机爆炸.gif",1,300,1));
    }

    time1 = 0;
  }

  //遍历数组
  var enemylen = enemys.length;
  for (var i = 0; i < enemylen; i++) {
    if(enemys[i].planisdie == false) {
      enemys[i].move();
    }

    //判断对应的敌方飞机是否超出边界
    if(enemys[i].plannode.offsetTop > 568) {
      maindiv.removeChild(enemys[i].plannode);   //删除节点
      enemys.splice(i,1);    //删除数组中的元素
      enemylen--;
    }

    //判断当前飞机是否为死亡
    if(enemys[i].planisdie == true) {
      enemys[i].diecount += 20;
      if (enemys[i].diecount == enemys[i].dietime) {
        //清除飞机
        maindiv.removeChild(enemys[i].plannode);
        enemys.splice(i,1);
       enemylen--;
      }
    }


     //1.本方飞机与敌方飞机的碰撞
      if(enemys[i].planisdie == false) {
        if(enemys[i].plannode.offsetLeft <= selfpaln.plannode.offsetLeft + 66 && enemys[i].plannode.offsetLeft + enemys[i].w  >= selfpaln.plannode.offsetLeft) {
          if(enemys[i].plannode.offsetTop <= selfpaln.plannode.offsetTop + 80 && enemys[i].plannode.offsetTop + enemys[i].h >= selfpaln.plannode.offsetTop + 20) {
            //碰撞
            //切换本方图片
            selfpaln.plannode.src = "image/本方飞机爆炸.gif";

            //显示结束界面
            enddiv.style.display = "block";

            //显示分数
            planscore.innerHTML = scores;

            //结束循环事件
            clearInterval(tid);

            //取消鼠标监听事件
            if(document.removeEventListener) {
              maindiv.removeEventListener("mousemove",ourmove,true);
            }else if(document.detachEvent) {
              maindiv.detachEvent("onmousemove",ourmove);
            }
          }
        }
      }

  }

  //创建子弹 6
  if(time1 % 5 == 0) {
    bullets.push(new oddbullet((selfpaln.plannode.offsetLeft + 31),(selfpaln.plannode.offsetTop)));
  }

  //移动子弹
  var bulletlen = bullets.length;
  for (var i = 0; i < bulletlen; i++) {
    bullets[i].move();

    if(bullets[i].bulletnode.offsetTop < 0) {
      //子弹超出边界
      maindiv.removeChild(bullets[i].bulletnode);
      bullets.splice(i,1);
      bulletlen--;
    }
  }

  //碰撞判断
  for (var k = 0; k < bulletlen; k++) {
    for(var j = 0; j < enemylen; j++) {


      //2.子弹与敌机碰撞
      if(bullets[k].bulletnode.offsetLeft <= enemys[j].plannode.offsetLeft + enemys[j].w && bullets[k].bulletnode.offsetLeft + 6 >= enemys[j].plannode.offsetLeft) {
        if(bullets[k].bulletnode.offsetTop <= enemys[j].plannode.offsetTop + enemys[j].h && bullets[k].bulletnode.offsetTop + 14 >= enemys[j].plannode.offsetTop) {
          //只有四个同时满足时,才有碰撞
          //enemys[j].plannode.src = enemys[j].boomsrc;
          enemys[j].hp -= 1;
          if(enemys[j].hp == 0) {
            enemys[j].plannode.src = enemys[j].boomsrc;

             //飞机标记为死亡
            enemys[j].planisdie = true;

            //统计分数
            scores += enemys[j].score;
            label.innerHTML = scores;
          }

          //删除子弹
          maindiv.removeChild(bullets[k].bulletnode);
          bullets.splice(k,1);
          bulletlen--;

          break;
        }
      }
    }
  }

}


// ––––––––––––––––––––––––––––创建对象–––––––––––––––––––––––––––
//创建父类构造函数
function plan(x,y,w,h,imgsrc,speed,boomsrc,hp,dietime,score) {
  this.x = x;
  this.y = y;
  this.imgsrc = imgsrc;
  this.speed = speed;

  this.w = w;
  this.h = h;

  this.boomsrc = boomsrc;

  this.hp = hp;

  //是否死亡
  this.planisdie = false;

  //死亡时间,用来延时爆炸
  this.dietime = dietime;
  this.diecount = 0;

  this.score = score;

  //显示飞机原理:创建节点,插入节点
  this.plannode = null;
  this.init = function() {
    this.plannode = document.createElement("img");
    this.plannode.style.position = "absolute";
    this.plannode.style.left = this.x + "px";
    this.plannode.style.top = this.y + "px";
    this.plannode.src = this.imgsrc;
  };
  this.init();

  //插入节点
  maindiv.appendChild(this.plannode);

  //行为
  //移动行为
  this.move = function() {
    this.plannode.style.top = this.plannode.offsetTop + this.speed + "px";
  }
}

//创建子弹的父类构造函数
function bullet(x,y,imgsrc) {
  this.x = x;
  this.y = y;
  this.imgsrc = imgsrc;

  this.bulletnode = null;
  this.init = function() {
    this.bulletnode = document.createElement("img");
    this.bulletnode.style.position = "absolute";
    this.bulletnode.style.left = x + "px";
    this.bulletnode.style.top = y + "px";
    this.bulletnode.src = this.imgsrc;

    maindiv.appendChild(this.bulletnode);
  }

  this.init();

  //行为
  this.move = function() {
    this.bulletnode.style.top = this.bulletnode.offsetTop - 20 + "px";
  }
}

//创建本方飞机构造函数
function selfpaln(x,y) {
  //f.call(o,a,b);   对象 o 调用 f 方法 ,其中 a,b 表示参数
  plan.call(this,x,y,null,null,"image/我的飞机.gif",null,null,null,null,null);
}
//1.本方飞机移动
var ourmove = function() {
  //clientY
  //获取事件触发后的event对象，做了一个兼容性处理。||用来做布尔短路，若浏览器存在window.event对象，
  //e就被指向该对象，否则指向事件处理函数的第一个参数，事件处理函数的第一个参数就是默认为该事件event对象。
  var oevent = window.event || arguments[0];
  var selfplanX = oevent.clientX - 500;
  var selfplanY = oevent.clientY;

  //selfpaln.plannode.style.left = selfplanX - 33 + "px";
  //selfpaln.plannode.style.top = selfplanY - 40 + "px";

  var x = oevent.clientX;
  var y = oevent.clientY;

  if(!(x < 533 || x > 787 || y < 40 || y > 528)) {
    selfpaln.plannode.style.left = selfplanX -33  + "px";
    selfpaln.plannode.style.top = selfplanY - 40 + "px";
  }
}

//2.超出边界事件
var borderline = function() {
  //1>.获取鼠标信息
  var oevent = window.event || arguments[0];

  var x = oevent.clientX;
  var y = oevent.clientY;

  //2>.500 33      500 320 33    80            568 40
  if(x < 533 || x > 787 || y < 40 || y > 528) {   //超出边界
    if(document.removeEventListener) {
      maindiv.removeEventListener("mousemove",ourmove,true);
    } else if(document.detachEvent) {
      maindiv.detachEvent("onmousemove",ourmove);
    }
  } else {
    if(document.addEventListener) {
      maindiv.addEventListener("mousemove",ourmove,true);
    }else if(document.attachEvent) {
      maindiv.attachEvent("onmousemove",ourmove);
    }
  }
}


//创建本方飞机对象
var selfpaln = new selfpaln(120,485);
//var selfpaln = new plan(120,485,"image/我的飞机.gif");

//–––––––––––––––––––––––––––––––––––敌方飞机––––––––––––––––––––––––––––––

//敌方飞机的构造函数
function enemy(a,b,w,h,imgsrc,speed,boomsrc,hp,dietime,score) {
  plan.call(this,random(a,b),50,w,h,imgsrc,speed,boomsrc,hp,dietime,score);
}
function random(a,b) {
  return Math.floor(Math.random()*(b-a) + a);
}


//–––––––––––––––––––––––––––––– 子弹–––––––––––––––––––––––––––
//创建单行子弹
function oddbullet(x,y) {
  bullet.call(this,x,y,"image/bullet1.png");
}

//3 ~ 10      Math.random()*(10-3)+3

//––––––––––––––––––––––––––––––––事件监听–––––––––––––––––––––––––
 if(document.addEventListener) {
  maindiv.addEventListener("mousemove",ourmove,true);

  //maindiv.addEventListener("mousemove",borderline,true);

 }else if(document.attachEvent) {

  maindiv.attachEvent("onmousemove",ourmove);

  //maindiv.attachEvent("onmousemove",borderline);
 }


