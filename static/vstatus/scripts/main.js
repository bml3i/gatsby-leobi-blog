window.onload = function onLoad() {

	var bar = new ProgressBar.SemiCircle('#container', {
	  strokeWidth: 6,
	  color: '#00cc00',
	  trailColor: '#eee',
	  trailWidth: 1,
	  easing: 'easeInOut',
	  duration: 800,
	  svgStyle: null,
	  text: {
	    value: '',
	    alignToBottom: false
	  },
	  from: {color: '#00cc00'},
	  to: {color: '#ED6A5A'},
	  // Set default step function for all animate calls
	  step: (state, bar) => {
	    bar.path.setAttribute('stroke', state.color);
	    var value = Math.round(bar.value() * 100);
	    if (value === 0) {
	      bar.setText('');
	    } else {
	      bar.setText(value);
	    }

	    bar.text.style.color = state.color;
	  }
	});
	bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
	bar.text.style.fontSize = '1rem';
	
	fetch("https://cors-anywhere.herokuapp.com/https://justmysocks5.net/members/getbwcounter.php?service=463251&id=3f405ae0-e4f6-4ab5-8ca9-0bfe0717ed86", {
		"method": "GET",
		"headers": {
			"origin": "null"
		}
	})
	.then(response => response.json())
	.then(data => {
		bar.animate(data.bw_counter_b / data.monthly_bw_limit_b, {
		    duration: 800
		}, function() {
		    bar.setText((data.bw_counter_b / 1000 / 1000 / 1000).toFixed(2) + 'G/' + (data.monthly_bw_limit_b / 1000 / 1000 / 1000).toFixed(0) + 'G');
		});
	})
	.catch(err => {
		console.error(err);
	});
	
};




