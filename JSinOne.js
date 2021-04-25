mp = null;   // MainPanel オブジェクト
gp = null;   // GamePanel オブジェクト

			//
			// キャンバス準備
			//
function mp_start()
{
					// キャンバス情報
	let canvas = document.getElementById('canvas_e');   // キャンバス要素の取得
	let ctx    = canvas.getContext('2d');   // キャンバスからコンテキストを取得
					// MainPanel オブジェクト
	mp = new MainPanel(canvas, ctx);
					// title の表示
	st_start();
}
			//
			// MainPanel オブジェクト（プロパティ）
			//
function MainPanel(canvas, ctx)
{
	this.canvas = canvas;   // キャンバス要素
	this.ctx    = ctx;   // キャンバスのコンテキスト
	this.level  = 1;   // ゲームレベル
	this.panel	= 0;	//画面制御 0:タイトル 1:ゲーム画面 2:ゲームクリア
	return this;
}
			//
			// MainPanel オブジェクト（メソッド）
			//
MainPanel.prototype.finish = function()
{
					// キャンバスのクリア
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
					// ボタンを非表示
	document.getElementById('method').style.display = "none";
	document.getElementById('start').style.display = "none";
	document.getElementById('first').style.display = "none";
	document.getElementById('finish').style.display = "none";
}
				
//
// タイトル画面 panel:0
//
function st_start()
{
    mp.level = 1;   // ゲームレベル・画面の設定
    mp.panel = 0;
                    // キャンバスのクリア
    mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
                    // ゲームタイトルの表示
    mp.ctx.font = "40px 'ＭＳ ゴシック'";
    mp.ctx.textBaseline = "middle";
    mp.ctx.textAlign = "center";
    mp.ctx.fillStyle = "rgb(50, 50, 50)";
    mp.ctx.fillText("アクションゲーム", mp.canvas.width/2, mp.canvas.height/2);
                    //画面クリックで遷移・クリック判定制御
    mp.canvas.addEventListener('click', mouseClick, true);
                    // ボタンの表示制御
    document.getElementById('method').style.display = "";
    document.getElementById('start').style.display = "";
    document.getElementById('first').style.display = "none";
    document.getElementById('finish').style.display = "none";
    document.getElementById('start').innerHTML = "ゲーム開始";
}

			//
			// Game画面 panel:1
			//
function gp_start()
{
					// GamePanel オブジェクト
	gp = new GamePanel();
	target_num = 0;
					// タイマーのスタート
	gp.timerID = setInterval('gp.draw()', 30);
					// マウスリスナの追加（マウスボタンが押された時）
	mp.canvas.addEventListener("click", gp.onMouseDown, true);
					// ボタンの表示制御
	document.getElementById('method').style.display = "none";
	document.getElementById('start').style.display = "none";
	document.getElementById('first').style.display = "none";
	document.getElementById('finish').style.display = "none";
}
			//
			// GamePanel オブジェクト（プロパティ）
			//
function GamePanel()
{
	this.timerID = -1;

	this.spawn_count = 0;
	//敵キャラの出現感覚
	if (mp.level == 1)
		{
			this.spawn = 70;//easy
		}
	else
		{
			this.spawn = 30;//hard
		}
		


	this.random_cr = Math.floor(Math.random() * 10);//ランダム初期値 0~9

	this.bg = new BackGround();   // BackGround オブジェクト

	this.cr = new Array();  // Chara オブジェクト用配列
	for (i = 0; i < 10; i++)
	{
		this.cr[i] = new Chara();
		if(i < 5){
			this.cr[i].x = 40 + (i * 80) - this.cr[i].width;
			this.cr[i].y = 100;
		} else {
			this.cr[i].x = 40 + ((i - 5) * 80) - this.cr[i].width;
			this.cr[i].y = 200;
		}
		
	}
	this.cr[this.random_cr].status = 1;

	return this;
}
			//
			// GamePanel オブジェクト（メソッド draw）
			//
GamePanel.prototype.draw = function()
{	
	if(gp.spawn_count < gp.spawn)
	{
		gp.spawn_count++;
	} 
	else
	{
		gp.cr[gp.random_cr].status = 0;
		gp.spawn_count = 0;
		//敵キャラ出現位置のランダム抽選
		random_cr_next = Math.floor(Math.random() * 9);// 0~8
		if (gp.random_cr >= random_cr_next)
		{
			gp.random_cr = random_cr_next + 1;
		}
		else
		{
			gp.random_cr = random_cr_next;
		}
		gp.cr[gp.random_cr].status = 1;
	}
		
					// キャンバスのクリア
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
					// 移動
	//gp.bg.x += gp.bg.v_x; //背景の移動は無しにする。
	//gp.cr.x += gp.cr.v_x; //敵キャラの出現方法変更
	// カウント
					// 背景描画
	mp.ctx.drawImage(gp.bg.image, gp.bg.x, gp.bg.y);

					//敵キャラ描画
	for(i = 0; i < 10; i++){
		if(gp.cr[i].status == 1)
			mp.ctx.drawImage(gp.cr[i].image, gp.cr[i].x, gp.cr[i].y, 45, 50);
	}
	
}
			//
			// GamePanel オブジェクト（メソッド onMouseDown）
			//
GamePanel.prototype.onMouseDown = function(e)
{
	var rect = e.target.getBoundingClientRect();
	var clkX = Math.floor(e.clientX - rect.left);
	var clkY = Math.floor(e.clientY - rect.top);
	console.log(gp.spawn_count);
	console.log(gp.spawn);
	for(i = 0; i < 10; i++)
	{
		if (clkX > gp.cr[i].x && clkX < gp.cr[i].x + 45)
			if (clkY > gp.cr[i].y && clkY < gp.cr[i].y + 50)
				if (mp.panel == 1)
					if (gp.cr[i].status == 1)
						{	
						clearInterval(gp.timerID);   // タイマーの停止
						mp.panel = 2;
						game_clear();
						}
	}


}
			//
			// BackGround オブジェクト（プロパティ）
			//
function BackGround()
{
	this.image = new Image();   // 背景
	this.v_x = -2.0;   // 背景の水平方向移動速度
	this.width = (mp.level == 1) ? 643 : 557;   // 背景画像の幅
	this.height = 300;   // 背景画像の高さ
					// 背景の読み込み
	if (mp.level == 1)
		this.image.src = "image/BackGround1.jpg";//easy
	else
		this.image.src = "image/BackGround2.jpg";//hard
					// 背景の初期位置
	this.x = 0;
	this.y = mp.canvas.height - this.height;
	return this;
}
			//
			// Chara オブジェクト（プロパティ）
			//
function Chara()
{
	this.image = new Image();   // 敵キャラ
	// 水平方向移動速度
	if (mp.level == 1)
	this.v_x = 1.0;//easy
	else
	this.v_x = 1.7;//hard

	// 垂直方向移動速度
	this.h_x = 1.0;   
	this.width = 32;   // 幅
	this.height = 52;   // 高さ
					// キャラの読み込み
	this.image.src = "image/chara.png";
					// キャラの個体数
	this.num = 10;
					//キャラの状態　0:非表示 1:出現
	this.status = 0;
					// キャラの初期位置
	this.x = -50;
	this.y = -50;
	return this;
}

//
// GameClear panel:2
//
function game_clear()
{
                    // キャンバスのクリア
    mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
                    // タイトルの表示
    mp.ctx.font = "40px 'ＭＳ ゴシック'";
    mp.ctx.textBaseline = "middle";
    mp.ctx.textAlign = "center";
    mp.ctx.fillStyle = "rgb(0, 0, 0)";
    mp.ctx.fillText("Game Clear!", mp.canvas.width/2, mp.canvas.height/2);
                    // ボタンの表示制御
    document.getElementById('method').style.display = "none";
    if (mp.level > 1) {   // 最初からゲーム再開
        document.getElementById('start').style.display = "none";
        document.getElementById('first').style.display = "";
    }
    else {   // レベルアップ
        document.getElementById('start').style.display = "";
        document.getElementById('first').style.display = "none";
        document.getElementById('start').innerHTML = "次のレベル";
    }
    document.getElementById('finish').style.display = "";
}

///クリック時
function mouseClick(e)
{
console.log(e.clientX + "," + e.clientY);

var rect = e.target.getBoundingClientRect();
var clkX = Math.floor(e.clientX - rect.left);
var clkY = Math.floor(e.clientY - rect.top);
    if(clkY > mp.canvas.height/5)
        if(clkX > mp.canvas.width)
            if (mp.panel == 0)//タイトル
                {
                    mp.panel = 1;
                    gp_start(); //ゲーム開始
				}
			if (mp.panel == 2)//ゲームクリア画面
			{
				if (mp.level > 1)
				{
                    mp.panel = 0;
                    st_start(); //タイトルへ
				} 
				else 
				{
					mp.panel = 1
					mp.level++;
					gp_start(); //次レベルでゲーム開始
				}
			}

        
}