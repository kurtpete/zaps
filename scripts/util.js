
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-28143703-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

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
var correct = 0;
var incorrect = 0;

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
    	if ($.inArray(ans, answered) < 0) {
    		answered.push(ans);
    		if ($('#answer-' + this.id).hasClass('incorrect')) {
    			incorrect++;
    			this.innerHTML = '<img src="../images/incorrect.gif"/>';
    			$("span", "#incorrect-button").text(formatSecondsAsTime(incorrect, "ss"));
    		}
    		else {
    			correct++;
    			this.innerHTML = '<img src="../images/correct.gif"/>';
    			$("span", "#correct-button").text(formatSecondsAsTime(correct, "ss"));
    		}
    	}
        $('#answer-' + this.id).dialog({
			modal: true,
			resizable: false,
			buttons: {
				Ok: function() {
					$(this).dialog( "close" );
					if ((correct + incorrect) == totalQuestions) {
						$("span", "#results-correct").text(formatSecondsAsTime(correct, "ss"));
						$("#test-results").dialog({
							modal: true,
							resizable: false,
							width:'auto',
							buttons: { Ok: function() { $(this).dialog("close"); } }
						});
					}
				}
			}
		});
   
   	return false;
   });
   
   $("#timer").click(function () {
   	$("#timer").off("click");
		$("#timer").button("disable");
		var t = setInterval(function() { 
	      $("span", "#timer").text(formatSecondsAsTime(--countdown, "mm:ss"));
	      if (countdown == 0) {        
	        clearInterval(t);
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
	});

	$("a", "#nav").button().parent().buttonset();
	
	$("#correct-button").button({icons: {primary: "ui-icon-circle-check"}}).parent().buttonset();	
	$("#incorrect-button").button({icons: {primary: "ui-icon-circle-close"}});
	
	$("#correct-button,#incorrect-button").click( function() {
		$("span", "#results-correct").text(formatSecondsAsTime(correct, "ss"));
		$("#test-results").dialog({
							modal: true,
							resizable: false,
							width:'auto',
							buttons: { Ok: function() { $(this).dialog("close"); } }
						});
		});
	
	$("#timer").button({icons: {primary: "ui-icon-clock"}});

	$("#sets").tabs(); 
	$("#accordion").accordion({autoHeight: false});
});
