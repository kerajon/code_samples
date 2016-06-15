
//////////////////////////////////////////////////
////////////////////////////////////// 	ELEVATION
//////////////////////////
function elev ( t, id, elevStart, elevStop, finish ) {
	if (elevStart===elevStop+1) {finish( t );return;}
	var timer = setTimeout( function () {
		t[id] = elevStart;
		elev( t, id, elevStart+1, elevStop, finish);
	}, 140);

}
//////////////////////////////////////////////////
////////////////////////////////////// 	MAIN CARD POSITION CONTROLER
//////////////////////////
function mainCardPosition ( t ) {
	var mainRef = t.ar[7], // main
        titleRef = t.ar[10], // title
        fabRef = t.ar[9], // fab,
        halRef = t.ar[23], //hal
        winH = windowHeight(),
        winW = windowWidth();

    t.ar[11].style.display = null;
    fabRef.style.display = null;
    titleRef.style.display = null;
    if (t.tm.halInSpace) t.ar[8].style.display = 'none';
    if (!t.tm.halInSpace) t.ar[8].style.display = null;

    // main
    document.body.style.backgroundColor = '#727272';
    //mainRef.style.width = t.mainWidth + 'px';
    //mainRef.style.height = t.mainHeight + 'px';
    mainRef.style['margin-right'] = ((winW - t.mainWidth)/2) + 'px';
    mainRef.style['margin-bottom'] = ((winH - t.mainHeight)/2) + 'px';
    mainRef.style['margin-left'] = ((winW - t.mainWidth)/2) + 'px';
    mainRef.style['background-color'] = '#ffffff';
    mainRef.style.display = null;
}
//////////////////////////////////////////////////
////////////////////////////////////// 	TEXT POSITION CONTROLER
//////////////////////////
function tPosition ( t ) {
	//moved changed
}

//////////////////////////////////////////////////
////////////////////////////////////// 	TYPING MACHINE
//////////////////////////
function TypingMachine ( app ) {

	var tm = this, _observeTextChange, hl, ref = [], tap, eyeLeft, eyeTop, eyeW, eyeH, eyeRef, halEye;;
	this.app = app;
	this.t = '|'
	this.textToType = '';
	this.wordsToListen = '';
	this.wordsToListenL = 0;
	this.old_textToType = '';
	this.typing = false;
	this.readyToType = {};
	this.readyToType.delay = 500;
	this.readyToType.intervalReady;
	this.trigerObservation = false;
	this.observeTextChange;				// timer

	// hal's class
	this.hal = new Hal( app, this );


	/* 	hal's mission is to present my skills
		if hal gets interrupted he is changing
		normal behavior to angry behavior
		which means no interaction with site, only skip action
		he starts to observe visitor

		mission start as listener detects textToType change
		presentation behavior and time depends on String
		so it's more like a written story

		presentation and hal's behavior are running independly
	*/
	this.onMission = false;
	this.halDisturbed = false;
	this.halChances = 2;
	this.halListenToVoice = false;
	this.halInSpace = false;

    function nodeRefCreator ( done ) {
    	var i, l = app.ar.length;
    	for (i = 0; i < l; i++) {
    		ref[i] = app.ar[i];
    		if (i === 21) tap = ref[21];  // tap init node --> now it can move
    	}
    	done( ref );
    }
    var textMutation = 1;
    // voice listener
    function _observeVoiceChange ( unregister ) {
    	var wordsToListen_l = tm.wordsToListen.length;
		if (arguments.length > 0) { clearInterval(tm.observeTextChange); return; }
		tm.observeTextChange = setInterval( function () {
			if (tm.halListenToVoice) if (tm.wordsToListen && tm.wordsToListen !== ' ') {
				if (textMutation === 1  || textMutation < wordsToListen_l) {
					textMutation = wordsToListen_l;
					tm._halVoiceRecognition();
				}
			}
		}, 500);
	}

	// typing observer
	_observeTextChange = function ( unregister ) {
		if (arguments.length > 0) { clearInterval(tm.observeTextChange); return; }
		tm.observeTextChange = setInterval( function () {
			if (tm.textToType && tm.textToType !== ' ') {
				tm._typing();
			}
		}, 500);
	}
	_observeTextChange();
	/*
	// DOM observer
	this.observer = new MutationObserver(function ( mutations ) {
		mutations.forEach(function ( mutation ) {
			// -->
			//console.log('mutation: ' + mutation.type);
			//var text = tap.innerText;
			//console.log(tap.innerText);
			tm.listenForKeywords(ref);


		});
	});
	// init settings of DOM observer
	this._trigerObservation = function () {
		var config = { characterData: true, subtree: true },
			tm = this;
		this.observer.observe( tap, config );
	};
	*/

	// TypingMachine init method
	this._fire = function () {
		var t = this;
		nodeRefCreator( function () {
			t._readyToType();
			t.onMission = true;	 // now hal is on the mission
			t.halInit( ref ); // avtivate hal behaviors
			t.hal.init();
			if (!t.trigerObservation) {
				// t._trigerObservation(); turn off not eficient
				t.trigerObservation = true;
			}
		} );
		hl = document.getElementById('halListen');

	};
	// TypingMachine methods
	this._typing = function() {
		// start typing --> allso start of presentation
		_observeTextChange(0); // unregister observer
		this._readyToType(0);
		tap.innerHTML = '&nbsp;';
		typingInProgress( this.textToType );

	};

	var words = [], 			// presentation mode
		wordsCount,				// presentation mode
		charsCount,				// presentation mode
		wordsPresentation = 0,		// presentation mode
		halsWords = [],				// angry hal mode
		waitDelay = 2000,		// (wait) waiting speed
		backspaceDelay = 30,	// deleting speed
		keyDelay = 150,			// typing speed
		spaceDelay = 200;		// space press speed

	function typingInProgress ( text ) {		// presentation start
		words = text.split(' '); // split by space
		wordsCount = words.length;
		word( wordsPresentation );
	};

	function word ( wordsPrinted ) {
		var delay = 1000,
			word = words[wordsPrinted];
		if (tm.halDisturbed) {
			tm.halAngryBehavior( wordsPrinted );
			return;
		}
		if (tm.halIsSpeaking) word = halsWords[wordsPrinted];
		if (!tm.halIsSpeaking) if(words.length === wordsPrinted) {
			waitOnFinish( delay );
			return;
		}
		if (tm.halIsSpeaking)  {
			if (halsWords.length === wordsPrinted) {
				tm.halIsSpeaking = false;
				tm.halAngryBehavior()
				return;
			}
		}
		if (word[0] === '.' && word[1]) {
			if(word[1] === word[1].toUpperCase()) {
				tm._listenForKeywords( wordsPrinted );
				return;
			}
		}
		if (word[0] === '(' && word.indexOf(')') > -1) {
			tm._listenForControlKeywords( wordsPrinted );
			return;
		}
		if (wordsPrinted !== 0 && arguments[1] === undefined) {
			typeSpace( wordsPrinted ); return;
		}

		typeKey( word, 0, word.length, wordsPrinted );
	}

	// control if close to out of parent
	function marque () {
		if (arguments[0] === 'done') return;
		if (tap.offsetWidth > app.halSpeekWidth - 10) {
			var old_text = tap.innerText;
			var new_text = old_text.slice(1);
			tap.innerText = new_text;
			marque();
		} else {
			marque('done');
		}
	}
	// key typeing
	function typeKey ( worde, progress, charsInWord, wordsPrinted ) {
		if (arguments.length === 3) if (arguments[1] === 'del') {// delete mode
			var timer,
				delay = arguments[0],
				del = arguments[1],
				wp = arguments[2];
			timer = setTimeout(function () {
				var text = tap.innerText, text_l = text.length;
				if (text_l !== 0) {
					var new_text = text.slice(0, text_l - 1);
					tap.innerText = new_text;
					typeKey( delay, del, wp );
				} else {
					word( wp + 1 );
				}
				return;
			}, delay * 10);
			return;
		}
		if (charsInWord === progress) {
			word( wordsPrinted + 1 );
			return;
		}
		marque();
		var timer = setTimeout(function () {
			tap.innerHTML += worde[progress];
			typeKey( worde, progress + 1, charsInWord, wordsPrinted );
		}, keyDelay);

	}
	// space typeing
	function typeSpace ( wordsPrinted ) {
		tap.innerHTML += '&nbsp;';
		if (arguments[1] === 'w') {
			word( wordsPrinted + 1, 0 );
		} else {
			word( wordsPrinted, 0 );
		}
		return;
	}
	// wait at finished --> idea was changed but time wont let me to fix few things
	function waitOnFinish ( delay ) {
		var timer0 = setTimeout(function () {
			finishedTyping();
		}, delay);
		var timer1 = setTimeout(function () {
			tm._readyToType();
		}, 500);
	}
	function finishedTyping () {
		tm.textToType = ' ';
		if (!tm.halListenToVoice) // tm._halVoiceRecognitionInit();
		_observeTextChange(); // register observer again
	}
	this._readyToType = function( stop ) {
		// clear text --> ready to type mode
		var delay = 800;
		ref[22].innerText = '|';
		if (arguments.length === 1) {tm.typing = true; return;}
		if (arguments.length === 0) tm.typing = false;
		startLine( this, delay );

		// place for functions
		function startLine ( t, delay ) {
			var timer;
			if (t.typing) return;
			ref[22].innerText = '|';
			timer = setTimeout( function () {
				stopLine( t, delay );
				clearTimeout(timer);
			}, delay);
		}
		function stopLine ( t, delay ) {
			var timer;
			if (t.typing) return;
			ref[22].innerHTML = '&nbsp;';
			timer = setTimeout( function () {
				startLine( t, delay );
				clearTimeout(timer);
			}, delay)
		}
	// end of _readyToTape
	};

//////////////////////////////////////////////////
////////////////////////////////////// 	HAL VOICE RECOGNITION
//////////////////////////

this._halVoiceRecognitionInit = function () {
	tm.halListenToVoice = true;
	_observeVoiceChange();
	hl.start();
	hl.addEventListener( 'result', function ( e ) {
		tm.wordsToListen = e.detail.result.slice(tm.wordsToListenL);
		console.log(tm.wordsToListen);
		console.log(tm.wordsToListenL + ' : ' + tm.wordsToListen.length);
		tm.wordsToListenL = tm.wordsToListen.length;
	} );
	hl.addEventListener( 'end', function ( e ) {
		hl.start();
	} );
	hl.addEventListener( 'error', function ( e ) {
		console.log(tm.wordsToListenL + ' : ' + tm.wordsToListen.length);
	} );
};
this.registeredVoiceKeywords = [
	['show', 'education', 'jobs', 'skills', 'hobby'],
	['hide', 'education', 'jobs', 'skills', 'hobby']
];

this.currentWords = [];
this.whichPartOfWord = 0;
this.waitingKeywords = [];
this.rocognitionResults = 0;
this._halVoiceRecognition = function () {
	var i,ii,iii, words = this.wordsToListen.split(' '),
		rvk = this.registeredVoiceKeywords,
		part = this.whichPartOfWord;
		console.log(words);
	if (this.waitingKeywords.length === 2) {
		this.waitingKeywords = [];
		part = 0;
	}
	if (this.waitingKeywords.length === 0) part = 0;
	if (this.waitingKeywords.length === 1) part = 1;

	for (i = 0; i < words.length; i++) {
		if (words.length > 1 && this.waitingKeywords.length === 1) {
				part = 1;
			}
		for (ii = 0; ii < rvk.length; ii++) {
			if (!part) if (words[i].indexOf(rvk[ii][part]) > -1) {
				this.waitingKeywords[part] = rvk[ii][part];
				if (words.length === 1) halAnswer( words[i] );
			}
			if (part) for (iii = part; iii < rvk[ii].length; iii++) {
				if (words[i].indexOf(rvk[ii][iii]) > -1) {
					this.waitingKeywords[part] = rvk[ii][iii];
					part = 0;
					hl.abort();
					gotMatch( this.waitingKeywords );
					return;
				}
			}
		}
	}
};
function gotMatch ( words ) {
	var fw, sw, kw;
	console.log(words);
	fw = words[0][0].toUpperCase();
	sw = words[1][0].toUpperCase();
	fw = fw + words[0].slice(1);
	sw = sw + words[1].slice(1);
	if (fw === 'Show') {
		fw = 'Open';
	} else if (fw === 'Hide') {
		fw = 'Close';
	}
	kw = fw + sw;
	halAnswer( fw, sw );
	console.log(kw);
	tm.keywords[kw]();
	return;
}

function halAnswer ( word ) {
	console.log(arguments[1]);
	if ( arguments.length === 2) {
	var fw = arguments[0], sw = arguments[1];
		if (fw === 'Open') {
			if (sw === 'Education') {
				tm.textToType = "Opening Education (wait)3 (clear)x";
			} else if (sw === 'Jobs') {
				tm.textToType = "Opening Jobs History (wait)3 (clear)x";
			} else if (sw === 'Skills') {
				tm.textToType = "Opening Skills (wait)3 (clear)x";
			} else if (sw === 'Hobby') {
				tm.textToType = "Opening Hobby (wait)3 (clear)x";
			}

		} else if (fw === 'Close') {
			if (sw === 'Education') {
				tm.textToType = "Closing Education (wait)3 (clear)x";
			} else if (sw === 'Jobs') {
				tm.textToType = "Closing Jobs History (wait)3 (clear)x";
			} else if (sw === 'Skills') {
				tm.textToType = "Closing Skills (wait)3 (clear)x";
			} else if (sw === 'Hobby') {
				tm.textToType = "Closing Hobby (wait)3 (clear)x";
			}
		}
	}
	if (arguments.length === 2) return;
	if (word === 'open') {
		tm.textToType = "What do you want me to open? (wait)3 (clear)x";
	} else if (word === 'close') {
		tm.textToType = "What do you want me to close? (wait)3 (clear)x";
	} else {
		tm.textToType = "Command canceled (wait)3 (clear)x";
	}

}

//////////////////////////////////////////////////
////////////////////////////////////// 	KEYWORDS
//////////////////////////

this.registeredKeywords = [
	'StartPresentation', 'StartRocket', 'OpenEducation', 'OpenJobs', 'OpenSkills', 'OpenHobby', 'CloseEducation', 'CloseJobs', 'CloseSkills', 'CloseHobby',
'ShowEducation', 'ShowJobs', 'ShowSkills', 'ShowHobby', 'HideEducation', 'HideJobs', 'HideSkills', 'HideHobby',
'DisableEducation', 'DisableJobs', 'DisableSkills', 'DisableHobby', 'ActivateEducation', 'ActivateJobs', 'ActivateSkills', 'ActivateHobby',
'EducationCheckbox_one_check', 'EducationCheckbox_two_check', 'JobsCheckbox_one_check', 'JobsCheckbox_two_check', 'JobsCheckbox_three_check', 'HobbyCheckbox_one_check', 'HobbyCheckbox_two_check',
'EducationCheckbox_one_uncheck', 'EducationCheckbox_two_uncheck', 'JobsCheckbox_one_uncheck', 'JobsCheckbox_two_uncheck', 'JobsCheckbox_three_uncheck', 'HobbyCheckbox_one_uncheck', 'HobbyCheckbox_two_uncheck',
'ShowEducation_item_one', 'ShowEducation_item_two', 'ShowJobs_item_one', 'ShowJobs_item_two', 'ShowJobs_item_three', 'ShowHobby_item_one', 'ShowHobby_item_two',
'HideEducation_item_one', 'HideEducation_item_two', 'HideJobs_item_one', 'HideJobs_item_two', 'HideJobs_item_three', 'HideHobby_item_one', 'HideHobby_item_two',
'FallStar', 'ShowSpeek', 'HideSpeek', 'ShowCosmos', 'HideCosmos', 'FontColor', 'FontShadow', 'BoxShadow', 'ShowSun', 'ShowPulsar', 'ShowSpacestation', 'LeaveCosmos',
'SetPosition', 'LoadMaincontainer', 'RoundAnimate', 'SkaleSkill', 'SkillJs', 'SkillPolymer',
'SkilljQuery', 'SkillCss', 'SkillHtml', 'SkillAngular', 'SkillStop', 'ShowStar', 'ShowTop', 'ShowFab', 'MissDone', 'ShowTitle', 'ShowContact', 'OpenContact'

];
this._listenForKeywords = function ( wordsPrinted ) {
	var i, ii, word = (!tm.halIsSpeaking) ? words[wordsPrinted] : halsWords[wordsPrinted], arr = word.slice(''), l = arr.length;
	word = '';
	for (ii = 1; ii < l; ii++) {
		word += arr[ii];
	}
	for (i = 0; i < this.registeredKeywords.length; i++) {
		if (word.indexOf(this.registeredKeywords[i]) > -1) {
			this.keywords[this.registeredKeywords[i]]( wordsPrinted );
			return;
		}
	}

};

// if one argument - planned presentation
// turnback function --> word( wordsPrinted + 1 )
// if async function keyword function --> turnback has to be inside
// that async function
//
// if no arguments - voice commands

this.keywords = {
	// PAPER-BUTTON
	// polymer: .show() / .hide()
	'OpenEducation': function ( wordsPrinted ) {
		ref[13].show();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'OpenJobs': function ( wordsPrinted ) {
		ref[15].show();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'OpenSkills': function ( wordsPrinted ) {
		ref[17].show();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'OpenHobby': function ( wordsPrinted ) {
		ref[19].show();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'CloseEducation': function ( wordsPrinted ) {
		ref[13].hide();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'CloseJobs': function ( wordsPrinted ) {
		ref[15].hide();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'CloseSkills': function ( wordsPrinted ) {
		ref[17].hide();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'CloseHobby': function ( wordsPrinted ) {
		ref[19].hide();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	// PAPER-BUTTON
	// display: none / null
	'ShowEducation': function ( wordsPrinted ) {
		ref[12].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowJobs': function ( wordsPrinted ) {
		ref[14].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowSkills': function ( wordsPrinted ) {
		ref[16].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowHobby': function ( wordsPrinted ) {
		ref[18].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideEducation': function ( wordsPrinted ) {
		ref[12].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideJobs': function ( wordsPrinted ) {
		ref[14].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideSkills': function ( wordsPrinted ) {
		ref[16].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideHobby': function ( wordsPrinted ) {
		ref[18].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	// PAPER-BUTTON
	// polymer - disabled: false / true
	'DisableEducation': function ( wordsPrinted ) {
		ref[12].disabled = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'DisableJobs': function ( wordsPrinted ) {
		ref[14].disabled = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'DisableSkills': function ( wordsPrinted ) {
		ref[16].disabled = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'DisableHobby': function ( wordsPrinted ) {
		ref[18].disabled = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ActivateEducation': function ( wordsPrinted ) {
		ref[12].disabled = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ActivateJobs': function ( wordsPrinted ) {
		ref[14].disabled = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ActivateSkills': function ( wordsPrinted ) {
		ref[16].disabled = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ActivateHobby': function ( wordsPrinted ) {
		ref[18].disabled = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	// PAPER-CHECKBOX
	// polymer - checked: false / true
	'EducationCheckbox_one_check': function ( wordsPrinted ) {
		ref[28].checked = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'EducationCheckbox_two_check': function ( wordsPrinted ) {
		ref[29].checked = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'JobsCheckbox_one_check': function ( wordsPrinted ) {
		ref[30].checked = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'JobsCheckbox_two_check': function ( wordsPrinted ) {
		ref[31].checked = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'JobsCheckbox_three_check': function ( wordsPrinted ) {
		ref[32].checked = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HobbyCheckbox_one_check': function ( wordsPrinted ) {
		ref[33].checked = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HobbyCheckbox_two_check': function ( wordsPrinted ) {
		ref[34].checked = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'EducationCheckbox_one_uncheck': function ( wordsPrinted ) {
		ref[28].checked = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'EducationCheckbox_two_uncheck': function ( wordsPrinted ) {
		ref[29].checked = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'JobsCheckbox_one_uncheck': function ( wordsPrinted ) {
		ref[30].checked = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'JobsCheckbox_two_uncheck': function ( wordsPrinted ) {
		ref[31].checked = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'JobsCheckbox_three_uncheck': function ( wordsPrinted ) {
		ref[32].checked = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HobbyCheckbox_one_uncheck': function ( wordsPrinted ) {
		ref[33].checked = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HobbyCheckbox_two_uncheck': function ( wordsPrinted ) {
		ref[34].checked = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	// PAPER-ITEM
	// polymer - hidden: false / true
	'ShowEducation_item_one': function ( wordsPrinted ) {
		ref[35].hidden = false;
		console.log(ref[35]);
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowEducation_item_two': function ( wordsPrinted ) {
		ref[36].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowJobs_item_one': function ( wordsPrinted ) {
		ref[37].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowJobs_item_two': function ( wordsPrinted ) {
		ref[38].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowJobs_item_three': function ( wordsPrinted ) {
		ref[39].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowHobby_item_one': function ( wordsPrinted ) {
		ref[40].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowHobby_item_two': function ( wordsPrinted ) {
		ref[41].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideEducation_item_one': function ( wordsPrinted ) {
		ref[35].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideEducation_item_two': function ( wordsPrinted ) {
		ref[36].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideJobs_item_one': function ( wordsPrinted ) {
		ref[37].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideJobs_item_two': function ( wordsPrinted ) {
		ref[38].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideJobs_item_three': function ( wordsPrinted ) {
		ref[39].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideHobby_item_one': function ( wordsPrinted ) {
		ref[40].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideHobby_item_two': function ( wordsPrinted ) {
		ref[41].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	// free for flow
	'LoadMaincontainer': function ( wordsPrinted ) {
		showMiddleContainer_Init( app );
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'FallStar': function ( wordsPrinted ) {
		for (var i = 0; i < 30; i++) {
			cosmoStar( app, 5, 'white' );
		}
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowSun': function ( wordsPrinted ) {
		loadSun( 30, 0, function () {
			// turnback
			word( wordsPrinted + 1 );
		} );
		function loadSun ( nr, len, cb ) {
			app.cosmoSun[len] = new Cosmos( 5, 'yellow');
			app.cosmoSun[len].addToCosmos( function () {
				var timer = setTimeout( function () {
					if (nr === len - 1) {
						cb();
						return;
					}
					loadSun( nr, len + 1, cb);
				}, 10 );
			});
		}
	},
	// no turnback inside async -- better effect of loading more components
	// like showing while continuing
	'ShowStar': function ( wordsPrinted ) {
		loadSun( 300, 0, function () {

		} );
		function loadSun ( nr, len, cb ) {
			app.cosmoSun[len] = new Cosmos( 2, 'white');
			app.cosmoSun[len].addToCosmos( function () {
				var timer = setTimeout( function () {
					if (nr === len - 1) {
						cb();
						return;
					}
					loadSun( nr, len + 1, cb);
				}, 10 );
			});
		}
		// turnback
		word( wordsPrinted + 1 );
	},
	'ShowPulsar': function ( wordsPrinted ) {
		loadSun( 10, 0, function () {
			// turnback
			word( wordsPrinted + 1 );
		} );
		function loadSun ( nr, len, cb ) {

			app.cosmoSun[len] = new Cosmos( 3, 'blue');
			app.cosmoSun[len].addToCosmos( function () {
				var timer = setTimeout( function () {
					if (nr === len - 1) {
						cb();
						return;
					}
					loadSun( nr, len + 1, cb);
				}, 10 );
			});
		}
	},
	'ShowSpacestation': function ( wordsPrinted ) {
		cosmoSpaceStation( app, function () {
		// turnback
		word( wordsPrinted + 1 );
		});
	},
	'ShowSpeek': function ( wordsPrinted ) {
		showSpeekWindow( app );
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideSpeek': function ( wordsPrinted ) {
		hideSpeekWindow( app );
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowCosmos': function ( wordsPrinted ) {
		app.tm.hal.controlPosition();
		ref[8].style.display = 'none';
		ref[43].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'HideCosmos': function ( wordsPrinted ) {
		ref[43].hidden = true;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'FontColor': function ( wordsPrinted ) {
		if (tm.halInSpace) ref[21].style.color = 'black';
		if (tm.halInSpace) ref[22].style.color = 'black';
		if (!tm.halInSpace) ref[21].style.color = '#a09d90';
		if (!tm.halInSpace) ref[22].style.color = '#a09d90';
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'FontShadow': function ( wordsPrinted ) {
		if (tm.halInSpace) document.querySelector( '#speek .card-content' ).style['text-shadow'] = '1px 1px 1px #cccccc';
		if (!tm.halInSpace) document.querySelector( '#speek .card-content' ).style['text-shadow'] = '1px 1px 1px #7a7271';

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'BoxShadow': function ( wordsPrinted ) {
		if (tm.halInSpace) document.querySelector( '#speek' ).style['box-shadow'] = '0 2px 2px 0 rgba(255, 255, 255, 0.14), 0 1px 5px 0 rgba(255, 255, 255, 0.12), 0 3px 1px -2px rgba(255, 255, 255, 0.2)';
		if (!tm.halInSpace) document.querySelector( '#speek' ).style['text-shadow'] = '1px 1px 1px #ffffff';

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'SetPosition': function ( wordsPrinted ) {
		presentHal( app, function () {
			// turnback
			word( wordsPrinted + 1 );
		});
	},
	'LeaveCosmos': function ( wordsPrinted ) {
		ref[42].remove(); // remove DOM element with all attached elements
		app.ar[8].style.display = null;
		tm.halInSpace = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'StartPresentation': function ( wordsPrinted ) {
		app.tm.hal.loadYourSelf( function () {
			word( wordsPrinted + 1 );
		} );
		//showHal( app );
		tm.halInSpace = true;
	},
	'SkaleSkill': function ( wordsPrinted ) {
		app.rao[0] = new Round( 100, {xV: 1, yV: 2}, 'white', 'paper-fab' );
		app.rao[0].skale = true;
		app.rao[0].show(  );

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'RoundAnimate': function ( wordsPrinted ) {
		var t  =  this;
		this.anim = window.requestAnimationFrame( animateJar );
		function animateJar () {
			app.rao.forEach(function ( skill ) {
				skill.update();
			});
			window.requestAnimationFrame( animateJar );
		}

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'SkillJs': function ( wordsPrinted ) {
		app.rao[0].showing = false;
		app.rao[0].ediv.opacity = '0.2';

		app.rao[1] = new Round( 65, {xV: 1, yV: 1.1}, '#ddd600', 'paper-fab' );
		app.rao[1].element.src = 'img/js.png';
		app.rao[1].show( );

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'SkillPolymer': function ( wordsPrinted ) {
		app.rao[1].showing = false;
		app.rao[1].ediv.opacity = '0.5';

		app.rao[2] = new Round( 75, {xV: 1.1, yV: 1}, '#8837a8', 'paper-fab' );
		app.rao[2].element.src = 'img/polymer.png';
		app.rao[2].show( );

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'SkilljQuery': function ( wordsPrinted ) {
		app.rao[2].showing = false;
		app.rao[2].ediv.opacity = '0.5';

		app.rao[3] = new Round( 50, {xV: 1, yV: 1}, '#0c0d1c', 'paper-fab' );
		app.rao[3].element.src = 'img/jquery.png';
		app.rao[3].show( );

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'SkillCss': function ( wordsPrinted ) {
		app.rao[3].showing = false;
		app.rao[3].ediv.opacity = '0.5';

		app.rao[4] = new Round( 45, {xV: 0.7, yV: 0.9}, '#4a4fa5', 'paper-fab' );
		app.rao[4].element.src = 'img/css.svg';
		app.rao[4].show( );

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'SkillHtml': function ( wordsPrinted ) {
		app.rao[4].showing = false;
		app.rao[4].ediv.opacity = '0.5';

		app.rao[5] = new Round( 60, {xV: 1, yV: 1}, '#ffc300', 'paper-fab' );
		app.rao[5].element.src = 'img/html.png';
		app.rao[5].show( );

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'SkillAngular': function ( wordsPrinted ) {
		app.rao[5].showing = false;
		app.rao[5].ediv.opacity = '0.5';

		app.rao[6] = new Round( 32, {xV: 1.2, yV: 1}, '#cc1818', 'paper-fab' );
		app.rao[6].element.src = 'img/angular.svg';
		app.rao[6].ediv.opacity = '0.7';
		app.rao[6].skale = true;
		app.rao[6].show(  );

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'SkillStop': function ( wordsPrinted ) {
		app.rao.forEach( function ( skill ) {
			if (!skill.skale) {
				skill.ediv.opacity = '1';
				skill.showing = false;
			}
		} );
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowTop': function ( wordsPrinted ) {
		ref[8].style.display = null;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowFab': function ( wordsPrinted ) {
		// styling fab img
		var fabImg = document.querySelector( '#fab img' );
		fabImg.style['border-radius'] = '50%';
		fabImg.style['width'] = '90px';
		fabImg.style['height'] = '90px';
		ref[9].hidden = false;
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowTitle': function ( wordsPrinted ) {
		// styling fab img
		ref[10].style.display = null;
		ref[10].hidden = false;
		this.bublesContainer = [];

		var t = this, bublesParams = [
			[40, 'white', 16, 'paper-card', 5, 20],
			[25, 'white', 17, 'paper-card', 40, 10],
			[40, 'white', 18, 'paper-card', 40, 40],
			[35, 'white', 19, 'paper-card', 45, 190],
			[20, 'white', 20, 'paper-card', 30, 170],
			[35, 'white', 21, 'paper-card', 40, 10],
			[40, 'white', 22, 'paper-card', 10, 60],
			[30, 'white', 23, 'paper-card', 25, 220],
			[40, 'white', 24, 'paper-card', 35, 120],
			[30, 'white', 25, 'paper-card', 20, 190],
			[40, 'white', 26, 'paper-card', 20, 120],
			[20, 'white', 27, 'paper-card', 65, 100],
			[8, 'white', 28, 'paper-card', 85, 265],
			[6, 'white', 29, 'paper-card', 94, 285],
			[4, 'white', 30, 'paper-card', 92, 300],
			// for shadow not efficent but good for now
			[40, 'white', 1, 'paper-card', 5, 20],
			[25, 'white', 2, 'paper-card', 40, 10],
			[40, 'white', 3, 'paper-card', 40, 40],
			[35, 'white', 4, 'paper-card', 45, 190],
			[20, 'white', 5, 'paper-card', 30, 170],
			[35, 'white', 6, 'paper-card', 40, 10],
			[40, 'white', 7, 'paper-card', 10, 60],
			[30, 'white', 8, 'paper-card', 25, 220],
			[40, 'white', 9, 'paper-card', 35, 120],
			[30, 'white', 10, 'paper-card', 20, 190],
			[40, 'white', 11, 'paper-card', 20, 120],
			[20, 'white', 12, 'paper-card', 65, 100],
			[8, 'white', 13, 'paper-card', 85, 265],
			[6, 'white', 14, 'paper-card', 94, 285],
			[4, 'white', 15, 'paper-card', 92, 300]
		];
		var b_len = bublesParams.length;
		loadSun( b_len, 0, function () {
			// turnback
			word( wordsPrinted + 1 );
		} );
		function loadSun ( nr, len, cb ) {
			if ( len === nr ) { cb(); return; }
			var a = bublesParams[len][0],
				b = bublesParams[len][1],
				c = bublesParams[len][2],
				d = bublesParams[len][3],
				e = bublesParams[len][4],
				f = bublesParams[len][5];

			t.bublesContainer[len] = new Buble( a, b, c, d, e, f );
			t.bublesContainer[len].element.elevation = '0';
			if (len >= (nr/2)-1 &&
				len < nr - 3) t.bublesContainer[len].element.elevation = '5';
			if (len === nr-1) t.bublesContainer[len].element.elevation = '2';
			if (len === nr-2) t.bublesContainer[len].element.elevation = '3';
			if (len === nr-3) t.bublesContainer[len].element.elevation = '4';
			t.bublesContainer[len].add( function () {
				var timer = setTimeout( function () {
					if (nr === len - 1) {
						cb();
						return;
					}
					loadSun( nr, len + 1, cb);
				}, 50 );
			});
		}
	},
	'MissDone': function ( wordsPrinted ) {
		app.tm.hal.stop();
		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'ShowContact': function ( wordsPrinted ) {
		ref[45].hidden = false;

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	},
	'OpenContact': function ( wordsPrinted ) {
		ref[46].show();

		// turnback
		if (arguments.length !== 0) word( wordsPrinted + 1 );
	}
};

this.registeredControlKeywords = [
	'(wait)', '(clear)', '(moveToNodeId)'
];

this._listenForControlKeywords = function ( wordsPrinted ) {
	var attr, index, oneWord, i, qCv, l=this.registeredControlKeywords.length, qChecker = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	oneWord = (!tm.halIsSpeaking) ? words[wordsPrinted] : halsWords[wordsPrinted];
	index = oneWord.indexOf(')');
	attr = oneWord.slice(index + 1);


	//attr = oneWord[oneWord.length - 1]
	oneWord = oneWord.slice(0, index + 1);
	for (i = 0; i < l; i++) {
		if (oneWord.indexOf(this.registeredControlKeywords[i]) > -1) {
			oneWord = this.registeredControlKeywords[i].slice(1, this.registeredControlKeywords[i].length - 1);
			this.controlKeywords[oneWord]( attr, wordsPrinted );
			return;
		}
	}
};

this.controlKeywords = {
	'wait': function ( delay, wordsPrinted ) {
		tm._readyToType();
		var timer = setTimeout( function () {
			tm._readyToType(0);
			// turnback
			word( wordsPrinted + 1 );
		}, delay * 1000);
		return;
	},
	'clear': function ( delay, wordsPrinted ) {
		var t = delay;
		t = (delay === 'x') ? 1 : delay;
		typeKey( t, 'del', wordsPrinted );
		return;
	},
	'moveToNodeId': function ( id, wordsPrinted ) {
		if (id === 'root') {
			tap = ref[21];
		} else {
			var nodeId = '#' + id;
			tap = document.querySelector( nodeId );
		}
		// turnback
		word( wordsPrinted + 1 );
	}
};

	this.halSpeeks = [
	">>>>>>>>>>> (wait)5 ",		// when 0 chances left
	"(clear)x >>>>>>>>>>> .OpenEducation"		// when 1 chance left
	];
	this.halInit = function ( ref ) {
		eyeRef = ref[25];
		// init
		eyeLeft = app.halEyeLeft;
		eyeTop = app.halEyeTop;
		eyeW = app.halEyeWidth;
		eyeH = app.halEyeHeight;
		//halInfoDom();

		halEye = [eyeLeft, eyeTop, eyeW, eyeH];
		this.halNormalBehavior();	// start hal's normal behavior
	};

	this.halNormalBehavior = function () {

		//eyePulse();
	};
	this.halAngryBehavior = function ( wordsPrinted ) {
		if (arguments.length === 0) {word( wordsPresentation ); return;}
		wordsPresentation = wordsPrinted;
		tm.halDisturbed = false;
		this.halChances -= 1;
		if (tm.halChances === 1) {
			warning( 1 );
		} else if (tm.halChances === 0) {
			warning( 0 );
		}
	};

	function warning ( chances ) {
		halsWords = tm.halSpeeks[chances].split(' ');
		tap = ref[21]; // go to root node
		tm.halIsSpeaking = true;
		console.log('halSpeeks');
		word( 0 );
		disableIneractions( chances );
	}

	function disableIneractions ( chances ) {
		if ( chances === 1 ) {
			// temporary disable of interactions
		} else if ( chances === 0 ) {
			// permanent disable of interactions
		}
	}

	this.reportToHal = function ( e ) {
		// look at e.x e.y position
		console.log('reported');
		tm.halDisturbed = true;
	};

	function eyePulse() {
			var timer, times, upTo;

			if (tm.halDisturbed) {
				times = 50;
				upTo = 20;
			} else {
				times = 300;
				upTo = 20;
			}
			// return on angry mode;
			if (arguments.length !== 0) {
				if (arguments[0] === 'grow') {
					var count = 0;
					var grow = setInterval(function () {
						count++;
						eyeRef.style.left = halEye[0] + 'px';
						eyeRef.style.top = halEye[1] + 'px';
						eyeRef.style.width = halEye[2] + 'px';
						eyeRef.style.height = halEye[3] + 'px';

						halEye[0] -= 1;
						halEye[1] -= 1;
						halEye[2] += 2;
						halEye[3] += 2;

						if (count === upTo) {
							clearInterval( grow );
							eyePulse( 'shrink' );
						}

					}, times);
				} else {
					count = 0;
					var shrink = setInterval(function () {
						count++;
						eyeRef.style.left = halEye[0] + 'px';
						eyeRef.style.top = halEye[1] + 'px';
						eyeRef.style.width = halEye[2] + 'px';
						eyeRef.style.height = halEye[3] + 'px';

						halEye[0] += 1;
						halEye[1] += 1;
						halEye[2] -= 2;
						halEye[3] -= 2;

						if (count === upTo) {
							clearInterval( shrink );
							eyePulse( 'grow' );
						}

					}, times);
				}
			} else {
				eyePulse('grow');
			}
		}



function halInfoDom () {
	console.log(app);
	var i, ii, e, id, a = app.domInfo, al = a.length;
	for  (i = 0; i < al; i++) {
		app.di[i] = [];
		for (ii = 0; ii < a[i].length; ii++) {
			id = a[i][ii];
			e = document.getElementById( id );
			if (i === 1) e.backgroundColor = 'white';
			app.di[i][app.di[i].length] = (i===0) ? e.backgroundColor : (i===1) ? e.color : (i===2) ? e.elevation : (i===3) ? e.checked : (i===4) ? e.disabled : (i===5) ? e.hidden : (i===6) ? e.opened : 'stop';
		}

	}
	console.log(app.di);
}


// end
}



/*
[
['education-button', 'job-button', 'skills-button', 'hobby-button', 'education-item-one', 'education-item-two'],
['education-button', 'job-button', 'skills-button', 'hobby-button', 'education-item-one', 'education-item-two'],
['education-button', 'job-button', 'skills-button', 'hobby-button', 'education-item-one', 'education-item-two'],
['education-cb-one', 'education-cb-two'],
['education-button', 'job-button', 'skills-button', 'hobby-button', 'education-cb-one', 'education-cb-two'],
['education-button', 'job-button', 'skills-button', 'hobby-button', 'education-item-one', 'education-item-two', 'education-cb-one', 'education-cb-two'],
['education-card', 'job-card', 'skills-card', 'hobby-card']
              ]
*/

/*
timeing and listening:

(wait)x - wait for x sec
(clear)x - clear input
(moveToNodeId)nodeId - move input to nodeId
*/
