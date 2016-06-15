// for loading page css display none controller
function hideDomElements ( t ) {
	t.ar[7].style.display = 'none';  // main
	t.ar[8].style.display = 'none';	//top
	t.ar[11].style.display = 'none';  // middle
	t.ar[10].style.display = 'none';  // middle

}

function showMiddleContainer_Init ( t ) {
	t.ar[7].style.display = null;
	t.ar[11].style.display = null;
}

// COMPUTING SPACES
function computeHalSpace_height ( t ) {
	return t.halHeight + t.halTop; // space --> height + top
}
function computeHalSpace_width ( ref ) {
	return t.halWidth + t.halLeft; // space --> width + left
}

// COMPUTING GLOBAL SPACES

function windowHeight () {
	return window.innerHeight;
}
function windowWidth () {
	return window.innerWidth;
}

// HAL
// main container of hal
function halSpaceInit ( t ) {
	var left, hal = t.ar[23];
	left = (windowWidth() - t.halWidth)/2;
	hal.style.top = t.halTop;
	hal.style.width = t.halWidth;
	hal.style.height = t.halHeight;
	hal.style.left = left + 'px';
	// dom info
	t.halLeft = left; // update so other would now
}
function speekInit ( t ) {
	var speek = t.ar[27], text = t.ar[21], taper = t.ar[22];
	speek.style['background-color'] = '#212121';
	speek.style['border-radius'] = '0 25px 25px 0';
	text.style.color = t.textColor;
	text.style.fontSize = t.textFontSize + 'px';
	text.style.height = t.textFontSize;
	taper.style.fontSize = t.textFontSize + 'px';
    taper.style.color = t.textColor;
    taper.style.height = t.textFontSize;
    document.querySelector( '#speek .card-content' ).style['text-shadow'] = '1px 1px 1px #d32f2f';
}
function halComputePosition ( t ) {
	var hal = t.ar[23], left;
	left = (windowWidth() - t.halWidth)/2;
	hal.style.left = left + 'px';
	t.halLeft = left;
}
function showHal ( t ) {
	var hal = t.ar[23], speek = t.ar[27];
	speek.style.width = '20px';
	taperHide( t );
	textHide( t );
	hal.style.left = (windowWidth() - t.halWidth)/2 + 'px';
	hal.style.top = (windowHeight() - t.halHeight)/2 + 'px';
	hal.style.display = null;
}
function presentHal ( t, finished ) {
	t.tm.hal.position_top = 10;
	t.tm.hal.positionTop();
	hideSpeekWindow( t, function () {
		showSpeekWindow( t );
		finished();
	});
}
// eye hal
// text
function textShow ( t ) {
	t.ar[21].style.display = null;
}
function textHide ( t ) {
	t.ar[21].style.display = 'none';
}
// taper
function taperShow ( t ) {
	t.ar[22].style.display = null;
}
function taperHide ( t ) {
	t.ar[22].style.display = 'none';
}
// textspeeach hal
function speekBGcolor ( t, color ) {
	var speek = t.ar[27];
	speek.style['background-color'] = color;
}
function hideSpeekWindow ( t, finished ) {
var speek = t.ar[27];
	slideOutSpeek( t, 350, 20, finished );
}
function showSpeekWindow ( t ) {
var speek = t.ar[27], text = t.ar[21], taper = t.ar[22];
	t.tm.hal.load_speek = true;
	t.tm.hal.controlPosition();
	if (t.tm.halInSpace) {speekBGcolor( t, 'white')} else {speekBGcolor( t, '#101316')}
	slideInSpeek( t, 20, 50 );
}
function slideInSpeek ( t, px, speed ) {
	var pxCurrent;
	clearAllSlidingAnimations( t );
	pxCurrent = px;
	t.animations.slideInSpeek = setInterval(function () {
		pxCurrent += speed;
		t.ar[27].style.width = pxCurrent + 'px';
		if (pxCurrent > 100) { taperShow( t ); }
		if (pxCurrent > 25) { textShow( t ); }
		if (pxCurrent > 340) {
			t.ar[27].style.width = 350 + 'px';
			clearInterval(t.animations.slideInSpeek);
		}
	}, 15);
}
function slideOutSpeek ( t, px, speed, finished ) {
	var pxCurrent, arg_len = arguments.length;
	clearAllSlidingAnimations( t );
	pxCurrent = px;
	t.animations.slideOutSpeek = setInterval(function () {
		pxCurrent -= speed;
		t.ar[27].style.width = pxCurrent + 'px';
		if (pxCurrent < 100) { taperHide( t ); }
		if (pxCurrent < 100) { textHide( t ); }
		if (pxCurrent < 25) {
			t.ar[27].style.width = 25 + 'px';
			if (arg_len === 4) { finished(); }
			clearInterval(t.animations.slideOutSpeek);
		}
	}, 15);
}
function clearAllSlidingAnimations ( t ) {
	clearInterval(t.animations.slideOutSpeek);
	clearInterval(t.animations.slideInSpeek);
	return;
}

// cosmos start presentation
function cosmosPosition ( t ) {
	// if img size smaller than window size u now what to do
	var cosmos = t.ar[43];
	cosmos.style.width = window.innerWidth;
	cosmos.style.height = window.innerHeight;
	cosmos.style['background-color'] = '#ccc';
}
function createSpaceStation ( t, report ) {
	var star, starX, starY, cosmos = t.ar[43], img;
	var speed, speedMeter = [45, 10, 5, 3, 25, 15];
	speed = speedMeter[rand( speedMeter.length - 1 )];
	star = document.createElement('div');
	img = document.createElement('img');
	img.src = '../../img/space-station.png';
	star.style.position = 'absolute';
	star.style.width = 128 + 'px';
	star.style.height = 128 + 'px';
	star.style.left = '-' + windowWidth() + 'px';
	star.style.top = '-' + windowHeight() + 'px';
	star.style.zIndex = '4';
	star.appendChild(img);
	cosmos.appendChild(star);
	starX = 1;
	starY = 1;
	moveStation( t, star, starX, starY, speed, report );
}
function moveStation ( t, star, starX, starY, speed, report ) {
	var boundX, boundY, counter, hit;
	boundX = windowWidth();
	boundY = windowHeight();
	if (posNeg() === '-') var neg = true;
	var starId = t.rememberMe_the_star.length;
	t.rememberMe_the_star[starId] = star.style;
	counter = 0;
	hit = false;
	t.rememberMe_a_star[starId] = setInterval( function () {
		counter++
		starX++
		starY++
		t.rememberMe_the_star[starId].left = starX + 'px';
		t.rememberMe_the_star[starId].top = starY + 'px';
		if (counter > windowHeight()/2 && !hit) { hit = !hit; report(); }
		if (counter > windowWidth() + (windowHeight()/2)) {
			clearInterval( t.rememberMe_a_star[starId] );
		}
	}, speed );
}
function starSpeed () {
var speedMeter = [45, 10, 5, 3, 25, 15];
return speedMeter[rand( speedMeter.length - 1 )];
}
function starBlur ( color ) {
if (color === 'yellow') {
	return {
		'-webkit-box-shadow': '-1px -1px 2px -5px rgba(230,220,21,1)',
		'-moz-box-shadow': '-1px -1px 2px -5px rgba(230,220,21,1)',
		'box-shadow': '-1px -1px 2px -5px rgba(230,220,21,1)'
	};
} else {
	return {
		'-webkit-box-shadow': null,
		'-moz-box-shadow': null,
		'box-shadow': null
	};
}
}
function createStar ( t, size, color ) {
	var starS, star, starX, starY, speed, cosmos = t.ar[43], size = rand(size), realStar = starBlur(color);

	speed = starSpeed();
	star = document.createElement('div');
	var starS = star.style;
	starS.position = 'absolute';
	starS.width = size + 'px';
	starS.height = size + 'px';
	starS['border-radius'] = '50%';
	starS.left = rand( windowWidth()/2 ) + 'px';
	starS.top = 0 + 'px';
	starS['background-color'] = color;
	starS.zIndex = '4';
	starS['-webkit-box-shadow'] = realStar['-webkit-box-shadow'];
	starS['-moz-box-shadow'] = realStar['-moz-box-shadow'];
	starS['box-shadow'] = realStar['box-shadow'];
	cosmos.appendChild(star);
	starX = posNeg() + rand( windowWidth() );
	starY = posNeg() + rand( windowHeight() );
	fallStar( t, star, starX, starY, speed );
}
function fallStar ( t, star, starX, starY, speed ) {
	var boundX, boundY, counter;
	boundX = windowWidth();
	boundY = windowHeight();
	if (posNeg() === '-') var neg = true;
	var starId = t.rememberMe_the_star.length;
	t.rememberMe_the_star[starId] = star;
	var sS = t.rememberMe_the_star[starId].style;
	counter = 0
	t.rememberMe_a_star[starId] = setInterval( function () {
		counter++
		if (neg) {starX--} else {starX++}
		if (neg) {starY--} else {starY++}
		sS.left = starX + 'px';
		sS.top = starY + 'px';
		if (counter > windowWidth() + 10) {
			clearInterval( t.rememberMe_a_star[starId] );
		}
	}, speed );
}
function cosmoStar ( t, size, color ) {
	createStar( t, size, color );
}
function cosmoSpaceStation ( t, report ) {
	createSpaceStation( t, report );
}
/* MATH HELPERS */
function rand ( nr ) {
	return ~~((Math.random() * nr) + 1);  // random between 0 and nr no time for more :(
}
function randMin ( nr, min ) {
	return ~~((Math.random() * nr) + min);  // random between 0 and nr no time for more :(
}
function posNeg () {
	var a =['-', '', '-'];
	return a[rand(2)];
}
// me speek in bubles
function Buble ( size, color, index, tag, top, right ) {


	// pre styling
	this.r = size;

	//create and set styling
	this.element = document.createElement( tag );
	this.ediv = this.element.style;
	this.ediv.right = right + 'px';
	this.ediv.top = top + 'px';
	this.ediv.position = 'absolute';
	this.ediv.height = this.r*2 + 'px';
	this.ediv.width = this.r*2 + 'px';
	this.ediv['border-radius'] = '50%';
	this.ediv['background-color'] = color;
	this.ediv.zIndex = index;
	this.ediv.display = null;
	this.ediv.opacity = null;
	this.toAdd = document.getElementById('top');
}
Buble.prototype.add = function( done ) {
	this.toAdd.appendChild(this.element);
	if (arguments[0]) done();
	return;
};
// cosmos randomnes and stars, pulsars and suns
function Cosmos ( size, color ) {

	// pre styling
	this.r = rand( size );
	this.cardW = windowWidth();
	this.cardH = windowHeight();
	this.realStar = starBlur('yellow');
	//create and set styling
	this.element = document.createElement('div');
	this.ediv = this.element.style;
	this.ediv.left = rand( windowWidth() ) + 'px';
	this.ediv.top = rand( windowHeight() ) + 'px';
	this.ediv.position = 'absolute';
	this.ediv.height = this.r*2 + 'px';
	this.ediv.width = this.r*2 + 'px';
	this.ediv['border-radius'] = '50%';
	this.ediv['background-color'] = color;
	this.ediv.zIndex = '4';
}
Cosmos.prototype.addToCosmos = function( done ) {
	document.getElementById('cosmos').appendChild(this.element);
	if (arguments[0]) done();
	return;
};

/**		skills class - balls :)
	**				   ||
		**			   ||
			**		   ||
				**	   \/
					**
						**
							**/
function Round ( size, speed, color, tag ) {

	this.showing = false;
	this.skale = false;

	// pre styling
	this.r = size;
	this.xV = speed.xV;
	this.yV = speed.yV;
	this.cardW = 388;
	this.cardH = 299;
	this.taped = false;

	//create and set styling
	this.element = document.createElement( tag );
	this.icon = this.element.src;
	this.ediv = this.element.style;
	this.ediv.left = this.r + 'px';
	this.ediv.top = this.r + 'px';
	this.ediv.position = 'absolute';
	this.ediv.height = this.r*2 + 'px';
	this.ediv.width = this.r*2 + 'px';
	this.ediv['border-radius'] = '50%';
	this.ediv['background-color'] = color;
	this.ediv.zIndex = 3;
	this.ediv.display = null;
	this.ediv.opacity = null;

	//init position
	this.el = this.r;
	this.et = this.r;
	this.save_xV = 1;
	this.save_yV = 1;
}
Round.prototype.update = function() {
	this.el += (this.xV * this.save_xV),
	this.et += (this.yV * this.save_yV);

	this.ediv.left = this.el + 'px';
	this.ediv.top = this.et + 'px';

	if (this.et > this.cardH - (this.r * 2)) {
      this.yV = Math.abs(this.yV) * -1;
      if (!this.showing) this.ediv.zIndex = rand( 10 );
    }
    if (this.el > this.cardW - (this.r * 2)) {
      this.xV = Math.abs(this.xV) * -1;
      if (!this.showing) this.ediv.zIndex = rand( 10 );
    }
    if (this.et < 0) {
      this.yV = Math.abs(this.yV);
      if (!this.showing) this.ediv.zIndex = rand( 10 );
    }
    if (this.el < 0) {
      this.xV = Math.abs(this.xV);
      if (!this.showing) this.ediv.zIndex = rand( 10 );
    }
};
Round.prototype.iconFit = function( done ) {
	var img = this.element.querySelector('img');
	if (img === null) return;
	//img.style['border-radius'] = '50%';
	img.style['width'] = this.r * 2 * 0.9 + 'px';
	img.style['height'] = this.r * 2 * 0.9 + 'px';
};
Round.prototype.show = function( done ) {
	var t = this;
	t.showing = true;
	document.getElementById('jar').appendChild(this.element);
	if (this.skale) { if (arguments[0]) done();  return;}
	this.ediv.zIndex = 15;
	this.element.addEventListener('tap', function ( e ) {
		e.bubles = false;
		e.preventDefault();
		t.taped = !t.taped;
		speedUpTap( t.taped, t );
	}, false);

};
function speedUpTap ( condition, scope ) {
	var timer, delay = 100, slowly = 10;
	if (condition){

		scope.ediv.zIndex = 12;
		scope.save_xV = 0;
		scope.save_yV = 0;
		return;
	} else {
		scope.ediv.zIndex = 4;
	}
	slowMeDown();
	return;
	function slowMeDown () {
		if (scope.taped){
			scope.save_xV = 0;
			scope.save_yV = 0;
			return;
		}
		slowly -= 0.2;
		delay += 10;
		scope.save_xV = slowly;
		scope.save_yV = slowly;
		if (slowly === 1 || slowly < 1) {
			clearTimeout(timer);
			return;
		}
		timer = setTimeout( function () {
			slowMeDown();
		}, delay);
	}
}


/*****************************************************************//*

hal behaviors:
#speek
slideInSpeek( scope ) 	// slide in animation
slideOutSpeak( scope )	// slide out animation
---------------------------------------------------------------------

hal positioning:
halSpaceInit( scope )	// initialize  position on load
halComputePosition( scope )	// compute position on resize


*//*****************************************************************/
function Speek ( scope, scopeTM ) {  // HAL's speek module

	// HAL 9000 speek card position inside container
	this.st = 15;	// position form the top
	this.sl = 50;	// position from left site
	// HAL 9000 speek size inside container
	this.sw = 350;	// eye's width with speek presentation
	this.sh = 70;	// eye's height
	// typing machine
	//taperHide( scope );	// hide taping machine experience
	//textHide( scope );	// hide taping machine text
	this.load_speek = false;
}
Speek.prototype.slideIn = function() {
	this.load_speek = true;
};
Speek.prototype.slideOut = function() {

};
function EyeShadow ( scope, scopeTM ) {  // HAL's eye shadow more like a container

	// THIS IS INVISIBLE PART
	// HAL 9000 shadow card position inside container
	this.est = 2;	// position form the top
	this.esl = 2;	// position from left site
	// HAL 9000 shadow card size
	this.esw = 90;	// eye's width with speek presentation
	this.esh = 90;	// eye's height
}
EyeShadow.prototype.animateRadius = function( animationFinished ) {
	this.eyeShadowS['border-radius'] = '0%';
	this.eyeShadowS.opacity = '0';
	this.eyeShadow.elevation = '0';
	this.load_eyeShadow = true;
	this.eyeShadowS.display = null;
	this.eyeShadow_radius = 0;
	this.eyeShadow_opacity = 0;
	this.eyeShadow_animationSpeed = 0.5;
	this.eyeShadow_opacitySpeed = 0.1;
	var t = this;
	function animate () {
		if (t.eyeShadow_radius === 51) {
			window.cancelAnimationFrame( t.animateEyeShadow );
			animationFinished();
			return;
		}
		if (t.eyeShadow_opacity !== 1) {
			t.eyeShadow_opacity += t.eyeShadow_opacitySpeed;
			t.eyeShadowS.opacity = t.eyeShadow_opacity.toString();
		}
		t.eyeShadow_radius += t.eyeShadow_animationSpeed;
		t.eyeShadowS['border-radius'] = t.eyeShadow_radius + '%';
		window.requestAnimationFrame( animate );
	}
	this.animateEyeShadow = window.requestAnimationFrame( animate );
};
EyeShadow.prototype.animateShadow = function( animationFinished ) {
	this.eyeShadow.elevation = '0';
	this.eyeShadow_elevation = 0;
	this.load_eyeShadow = true;
	this.eyeShadowS.display = null;
	this.eyeShadow_elevationSpeed = 0.5;
	var t = this;
	function animate () {
		if (t.eyeShadow_elevation === 5) {
			window.cancelAnimationFrame( t.animateEyeShadow );
			animationFinished();
			return;
		}
		t.eyeShadow_elevation += t.eyeShadow_elevationSpeed;
		t.eyeShadow.elevation = t.eyeShadow_elevation.toString();
		window.requestAnimationFrame( animate );
	}
	this.animateEyeShadow = window.requestAnimationFrame( animate );
};
function EyeRed ( scope, scopeTM ) {  // HAL's red eye

	// HAL 9000 eye position on the screen
	this.ert = 26;	// position form the top
	this.erl = 22;	// position from left site
	// HAL 9000 eye position on the screen
	this.erw = 50;	// eye's width with speek presentation
	this.erh = 50;	// eye's height
}
EyeRed.prototype.animateEyeRed = function( animationFinished ) {
	this.load_eyeRed = true;
	this.eyeRedS.display = null;
	this.eyeRedS.opacity = '0';
	this.eyeRedS_opacity = 0;
	this.eyeRedS_opacitySpeed = 0.1;
	var t = this;
	function animate () {
		if (t.eyeRedS_opacity === 1) {
			window.cancelAnimationFrame( t.animateEyeShadow );
			animationFinished();
			return;
		}
		t.eyeRedS_opacity += t.eyeRedS_opacitySpeed;
		t.eyeRedS.opacity = t.eyeRedS_opacity.toString();
		window.requestAnimationFrame( animate );
	}
	this.animateEyeShadow = window.requestAnimationFrame( animate );

	animationFinished();
};
EyeRed.prototype.animateEyePulse = function() {
	this.eyeRedS.left = this.erl + 'px';
	this.eyeRedS.top = this.ert + 'px';
	this.eyeRedS.width = this.erw + 'px';
	this.eyeRedS.height = this.erh + 'px';

	this.eyeRedS_growSpeed = 0.05;
	var t = this;
	function animate () {
		if (t.erw > 63) { // max width
			t.eyeRedS_growSpeed = Math.abs(t.eyeRedS_growSpeed) * -1;
		} else if (t.erw < 53) { // min width
			t.eyeRedS_growSpeed = Math.abs(t.eyeRedS_growSpeed) * 1;
		}
		t.erl -= t.eyeRedS_growSpeed;
		t.eyeRedS.left = t.erl + 'px';
		t.ert -= t.eyeRedS_growSpeed;
		t.eyeRedS.top = t.ert + 'px';

		t.erw += t.eyeRedS_growSpeed * 2;
		t.eyeRedS.width = t.erw + 'px';
		t.erh += t.eyeRedS_growSpeed * 2;
		t.eyeRedS.height = t.erh + 'px';

		window.requestAnimationFrame( animate );
	}
	this.animateEyeRedPulse = window.requestAnimationFrame( animate );
};
EyeRed.prototype.animateEyeLookRight = function() {
	//window.cancelAnimationFrame( this.animateEyeRedPulse ); // cancel pulse animation
	this.eyeRedS.left = this.erl;
	this.eyeRedS.top = this.ert;
	this.eyeRedS.width = this.erw;
	this.eyeRedS.height = this.erh;

	this.eyeRedS_growSpeed = 0.1;
	this.eyeRedS_moveSpeed = 0.1;
	this.eyeRedS_moveWayStart = 0;
	this.eyeRedS_moveWayStop = -10;
	var t = this;
	function animate () {

		if (Math.abs(t.eyeRedS_moveWayStart) > Math.abs(t.eyeRedS_moveWayStop)) {
			t.eyeRedS_moveSpeed = Math.abs(t.eyeRedS_moveSpeed) * 1;
		} else if (Math.abs(t.eyeRedS_moveWayStart) < Math.abs(t.eyeRedS_moveWayStop)) {
			t.eyeRedS_moveSpeed = Math.abs(t.eyeRedS_moveSpeed) * -1;
		}
		t.eyeRedS_moveWayStart += t.eyeRedS_moveSpeed;
		t.erl -= t.eyeRedS_growSpeed + t.eyeRedS_moveSpeed;
		t.eyeRedS.left = t.erl + 'px';
		t.ert -= t.eyeRedS_growSpeed;
		t.eyeRedS.top = t.ert + 'px';

		window.requestAnimationFrame( animate );
	}
	this.animateEyeRedPulse = window.requestAnimationFrame( animate );
};
function Eye ( scope, scopeTM ) {  // HAL's eye container

	// HAL 9000 eye position on the screen
	this.et = 0;	// position form the top
	this.el = 0;	// position from left site
	// HAL 9000 eye position on the screen
	this.ew = 100;	// eye's width with speek presentation
	this.eh = 100;	// eye's height
}
Eye.prototype.animateEye = function( animationFinished ) {
	this.load_eye = true;
	this.eyeS.display = null;
	this.eyeS.opacity = '0';
	this.eyeS_opacity = 0;
	this.eyeS_opacitySpeed = 0.1;
	var t = this;
	function animate () {
		if (t.eyeS_opacity === 1) {
			window.cancelAnimationFrame( t.animateEyeShadow );
			animationFinished();
			return;
		}
		t.eyeS_opacity += t.eyeS_opacitySpeed;
		t.eyeS.opacity = t.eyeS_opacity.toString();
		window.requestAnimationFrame( animate );
	}
	this.animateEyeShadow = window.requestAnimationFrame( animate );

	animationFinished();
};
function Hal ( scope, scopeTM ){
	this.t = scope;
	this.tm = scopeTM;
	// load hal's eye
	Eye.call( this, scope );
	EyeRed.call( this, scope );
	EyeShadow.call( this, scope );
	// load hal's speek module
	Speek.call( this, scope );
	// HAL 9000 position on the screen
	this.ht = (windowHeight() - this.hh)/2;	// init position form the top
	this.hl = (windowWidth() - this.hw)/2;	// init position from left site
	this.hw = 400;	// hal's width with speek presentation
	this.hh = 100;	// hal's height
	this.position_top = 'center';

	this.hidden = false;
	this.load_animationInProgress = true;
	this.load_eal = false;
	this.load_eyeShadow = false;
	this.load_eye = false;
	this.load_eyeRed = false;

	this.loaded = false;
}
Hal.prototype.init = function() {
	// HAL 9000 elements
	this.hal = this.t.ar[23] || document.getElementById('hal');
	// HAL 9000 eye elements
	this.eye = this.t.ar[24] || document.getElementById('eye');
	// HAL 9000 eye elements
	this.eyeRed = this.t.ar[25] || document.getElementById('redEye');
	// HAL 9000 eye elements
	this.eyeShadow = this.t.ar[26] || document.getElementById('eyeShadow');
	// HAL 9000 eye elements
	this.speek = this.t.ar[27] || document.getElementById('speek');

	this.loaded = true;		// hal is loade
	this.t.loaded = true;	// informaction for outside world
	this.halS = this.hal.style;
	this.eyeS = this.eye.style;
	this.eyeRedS = this.eyeRed.style;
	this.eyeShadowS = this.eyeShadow.style;
	this.speekS = this.speek.style;
};
Hal.prototype.show = function() {
	this.halS.display = null;
	this.eyeS.display = null;
	this.eyeRedS.display = null;
	this.eyeShadowS.display = null;
	this.speekS.display = null;
};
Hal.prototype.hide = function() {
	this.halS.display = 'none';
	this.eyeS.display = 'none';
	this.eyeRedS.display = 'none';
	this.eyeShadowS.display = 'none';
	this.speekS.display = 'none';
};
Hal.prototype.stop = function() {
	this.hidden = true;
	this.halS.display = 'none';
	this.eyeS.display = 'none';
	this.eyeRedS.display = 'none';
	this.eyeShadowS.display = 'none';
	this.speekS.display = 'none';
};
Hal.prototype.computeTop = function( top ) {
	if (isNaN(arguments[0])) { return (windowHeight() - this.hh)/2; }
	else { return arguments[0]; }
};
Hal.prototype.computeLeft = function() {
	return (windowWidth() - this.hw)/2;
};
Hal.prototype.positionTop = function() {
	this.position_top = 10;
};
Hal.prototype.controlPosition = function() {

	if (!this.hidden) if (this.load_animationInProgress) {
		this.halS.display = (this.load_hal) ? null : 'none';
		this.eyeS.display = (this.load_eye) ? null : 'none';
		this.eyeRedS.display = (this.load_eyeRed) ? null : 'none';
		this.eyeShadowS.display = (this.load_eyeShadow) ? null : 'none';
		this.speekS.display = (this.load_speek) ? null : 'none';
	} else { Hal.prototype.show.call(this); }

	this.halS.left = Hal.prototype.computeLeft.call(this) + 'px';
	this.halS.top = Hal.prototype.computeTop.call(this, this.position_top) + 'px';
};
Hal.prototype.loadYourSelf = function( done ) {
	this.load_hal = true;
	this.halS.display = null;
	var t = this;
	EyeShadow.prototype.animateRadius.call(this, function () {
		Eye.prototype.animateEye.call(t, function () {
			EyeShadow.prototype.animateShadow.call(t, function () {
				EyeRed.prototype.animateEyeRed.call(t, function () {
					EyeRed.prototype.animateEyePulse.call( t );
					EyeRed.prototype.animateEyeLookRight.call(t);
					done();
				});
			});
		});
	});
};
