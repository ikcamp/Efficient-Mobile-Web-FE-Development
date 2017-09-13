(function(){
	//游戏时间10s
	var result = 0,
		delay = 50,
		startPeople,
		explosion;
	var playBtn = document.querySelector('.play');
	var renderer = PIXI.autoDetectRenderer(800, 600,{transparent: true});
	document.body.appendChild(renderer.view);
	// create the root of the scene graph
	var stage = new PIXI.Container();

	PIXI.loader
	  .add('scene', 'images/game_area.png')
      .add('man', 'images/game_begin_people.png')
      .add('images/people.json')
      .load(function(loader, res){
      	//场景
        var scene = new PIXI.Sprite(res.scene.texture);
        stage.addChild(scene);
		//启动人物
        startPeople = new PIXI.Sprite(res.man.texture);
        startPeople.position.set(800 /2, 600 /2 - 30);
        startPeople.anchor.set(0.5);
        stage.addChild(startPeople);
		//分数
		var scoreStyle = {
          fontSize: '32px',
          fontStyle: 'normal',
          fill : '#ff973e'
        };
        var score = new PIXI.Text( result + '分', scoreStyle);
        score.position.set(554, 20);
        score.anchor.set(0);
        stage.addChild(score);
		//开学君
        var frames = [];
        for(var i = 1; i < 3; i++) {
          frames.push(PIXI.Texture.fromFrame('people-' + i + '.png'));
        }
        explosion = new PIXI.extras.MovieClip(frames);
        explosion.anchor.set(0.5);
        explosion.position.set(800 / 2, 600 / 2);
        explosion.animationSpeed = 0.05;
        explosion.interactive = true;
        explosion.on('mousedown', onDown);
		explosion.on('touchstart', onDown);
		function onDown () {
			result++;
			score.setText(result + '分', scoreStyle);
			var x = Math.random() * (800 - explosion.width) + explosion.width / 2;
			var y = Math.random() * (600 - explosion.height) + explosion.height / 2;
			explosion.position.set(x, y);
			delay = 50
		}
		renderer.render(stage);
      });
	
	// start animating
	playBtn.addEventListener('click',function(){
		this.style.display = 'none';
		stage.removeChild(startPeople);
        stage.addChild(explosion);
		explosion.play();
		animate();
	});
	function animate() {
		// 变动位置
		delay--;
		while(delay === 0){
			var x = Math.random() * (800 - explosion.width) + explosion.width / 2;
			var y = Math.random() * (600 - explosion.height) + explosion.height / 2;
			explosion.position.set(x, y);
			delay = 50
		}
	    requestAnimationFrame(animate);
	    // render the root container
	    renderer.render(stage);
	}
})()