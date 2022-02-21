window.onload = function onLoad() {

	var bar = new ProgressBar.SemiCircle('#container', {
	  strokeWidth: 6,
	  color: '#FFEA82',
	  trailColor: '#eee',
	  trailWidth: 1,
	  easing: 'easeInOut',
	  duration: 1400,
	  svgStyle: null,
	  text: {
	    value: '',
	    alignToBottom: false
	  },
	  from: {color: '#FFEA82'},
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
	bar.text.style.fontSize = '2rem';

	// python3 -m http.server
	// http://127.0.0.1:8000/demo.json
	// https://justmysocks5.net/members/getbwcounter.php?service=463251&id=3f405ae0-e4f6-4ab5-8ca9-0bfe0717ed86
	
	//let url = '/demo.json';
	let url = 'https://justmysocks5.net/members/getbwcounter.php?service=463251&id=3f405ae0-e4f6-4ab5-8ca9-0bfe0717ed86';
	
	fetch(url)
	  .then(response => response.json())
	  .then(data => bar.animate(data.bw_counter_b / data.monthly_bw_limit_b));
};


