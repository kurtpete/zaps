
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-28143703-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
  
function deselect() {
	if (document.selection) {
		document.selection.empty();
		Copied=document.body.createTextRange();
		}
	else if (window.getSelection) {
		window.getSelection().removeAllRanges();
	}
}

function formatSecondsAsTime(secs, format) {
  var hr  = Math.floor(secs / 3600);
  var min = Math.floor((secs - (hr * 3600))/60);
  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

  if (hr < 10)   { hr    = "0" + hr; }
  if (min < 10) { min = "0" + min; }
  if (sec < 10)  { sec  = "0" + sec; }
  if (hr)            { hr   = "00"; }

  if (format != null) {
    var formatted_time = format.replace('hh', hr);
    formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
    formatted_time = formatted_time.replace('mm', min);
    formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
    formatted_time = formatted_time.replace('ss', sec);
    formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
    return formatted_time;
  } else {
    return hr + ':' + min + ':' + sec;
  }
}

var answered = new Array();
var correct_answered = new Array();
var incorrect_answered = new Array();
var correct = 0;
var incorrect = 0;

var timer_on = false;
var timer_interval;

jQuery(document).ready(function($) {

	// ie focus rectangle removal
	$('a').mousedown(function() {
  		this.hideFocus = true;  /* IE6-7 */
  		this.style.outlineStyle = 'none';  /* FF2+, IE8 */
	});	
	
	$('.correct').attr('title', '<img src="../images/correct.gif"/> Correct!');
	$('.incorrect').attr('title', '<img src="../images/incorrect.gif"/> Incorrect');
	
	$("a.response").click( function() { 
		var ans = this.id.slice(0, -1);

		if ($('#answer-' + this.id).hasClass('incorrect')) {
			if (incorrect_answered.indexOf(ans) < 0) {
				incorrect_answered.push(ans);
				incorrect++;
			}
			
			if (correct_answered.indexOf(ans) > -1) {
				correct_answered.splice(correct_answered.indexOf(ans), 1);
			}
		}
		else {
			if (correct_answered.indexOf(ans) < 0) {
				correct_answered.push(ans);
				correct++;
			}

			if (incorrect_answered.indexOf(ans) > -1) {
				incorrect_answered.splice(incorrect_answered.indexOf(ans), 1);
			}
		}		
		
		if (!timer_on) {
	    	if ($.inArray(ans, answered) < 0) {
	    		answered.push(ans);
	    		if ($('#answer-' + this.id).hasClass('incorrect')) {
	    			this.className += ' incorrect_answered_question';
	    			//this.innerHTML = '<img src="../images/incorrect.gif"/>';
	    			$("span.incorrect-answers").text(formatSecondsAsTime(incorrect, "ss"));
	    		}
	    		else {
	    			//this.innerHTML = '<img src="../images/correct.gif"/>';
	    			this.className += ' correct_answered_question';
	    			$("span.correct-answers").text(formatSecondsAsTime(correct, "ss"));
	    		}
	    	}
	        $('#answer-' + this.id).dialog({
				modal: true,
				resizable: false,
				buttons: {
					Ok: function() {
						$(this).dialog( "close" );
					}
				}
			});
      }
      else {
      	// this.innerHTML = '<img src="../images/black.jpg"/>';
			$('a[id^=' + ans + ']').removeClass('answered_question');     	
      	
      	this.className += ' answered_question';
      }

		if ((correct + incorrect) == totalQuestions) {
			$("span", "#results-correct").text(formatSecondsAsTime(correct, "ss"));
			$("#test-results").dialog({
				modal: true,
				resizable: false,
				width:'auto',
				buttons: { Ok: function() { $(this).dialog("close"); } }
			});
		}      
      
   	return false;
   });
   
   $("#timer").click(function () {
   	// $("#timer").off("click");
		// $("#timer").button("disable");
		if (!timer_on) {
			timer_on = true;
			timer_interval = setInterval(function() { 
		      $("span", "#timer").text(formatSecondsAsTime(--countdown, "mm:ss"));
		      if (countdown == 0) {        
		        clearInterval(timer_interval);
		        $("span.correct-answers").text(formatSecondsAsTime(correct, "ss"));
		        $("span.incorrect-answers").text(formatSecondsAsTime(incorrect, "ss"));
		        $("#time-up").dialog({
						modal: true,
						resizable: false,
						buttons: { Ok: function() { 
							$(this).dialog("close"); 
							$("span", "#results-correct").text(formatSecondsAsTime(correct, "ss"));
							$("#test-results").dialog({
								modal: true,
								resizable: false,
								width:'auto',
								buttons: { Ok: function() { $(this).dialog("close"); } }
							});
							} }
					});				
					}
				}, 1000)
		}
		else {
			clearInterval(timer_interval);
			timer_on = false;
		}
		
		return false;
	});

	$("a", "#nav").button().parent().buttonset();
	
	$("#correct-button").button({icons: {primary: "ui-icon-circle-check"}}).parent().buttonset();	
	$("#incorrect-button").button({icons: {primary: "ui-icon-circle-close"}});
	
	$("#correct-button,#incorrect-button").click( function() {
		
		$("#answers-info").dialog({
							modal: true,
							resizable: false,
							width: '400px',
							buttons: { Ok: function() { $(this).dialog("close"); } }
						});
		
		//$("span", "#results-correct").text(formatSecondsAsTime(correct, "ss"));
		//$("#test-results").dialog({
		//					modal: true,
		//					resizable: false,
		//					width:'auto',
		//					buttons: { Ok: function() { $(this).dialog("close"); } }
		//				});
		});
	
	$("#timer").button({icons: {primary: "ui-icon-zaps-clock"}});

	$("#sets").tabs(); 
	$("#tabs").tabs(); 
	
	//$(document).bind("contextmenu",function(e) {  
	//        return false;  
	//});

	// timerID=setTimeout('setInterval("deselect()", 1)', 1);
});
