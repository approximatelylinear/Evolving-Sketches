// Global abatement container
var UTILITIES = UTILITIES || {}; 


// Pass an object {coord_val: val} 
//		e.g. setPosition({'x': 10, 'y': 10})
// or a string identifying a coordinate and the value to assign it
// 		e.g. setPosition('x', 10) 
UTILITIES.attrSetter = function (property, attr, value) {
	attr = attr || {};
	value = value || 0; 
	
	// Called with individual coord and value
	if (!jQuery(isPlainObject(attr))){
		this.position[attr] = value;
	}
	
	// Called with object
	else {
		jQuery.each(attr, function (k, v) {
			this[prop][k] = v; 
		});
		
	}

	return this;
}; 
	
	
UTILITIES.geq = function (x, y) {
	return x >= y;
}
//end geq


UTILITIES.leq = function (x, y) {
	return x <= y;

}//end leq


UTILITIES.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min; 
};


UTILITIES.sign = function (x) {
	if (x==0) { 
		return 0;
	}
	else {
		return x/Math.abs(x);
	}
};



// Radial gradient using the given list of colors.
UTILITIES.radialGradient = function (colors, x, y, radius, steps) { 
	steps = steps || 300;
	
    var step = function(colors, i, n) {
		var l = colors.length - 1,
			a = 1.0 * i/n *l,
			a = Math.min(a + 0, l),
			b = Math.min(a + 1, l),
			base = 1.0 * n/l * a,
			d = (i-base) / (n/l),		
			r = colors[a]['r'] * (1-d) + colors[b]['r'] * d,
			g = colors[a]['g'] * (1-d) + colors[b]['g'] * d,
			b = colors[a]['b'] * (1-d) + colors[b]['b'] * d;
		//return {
		//		'r': r,
		//		'g': g,
		//		'b': b
		//};
		return [r, g, b];
	}
	
    for (var i; i <= steps.length; i += 1) {
		var rgbArray = step(colors, i, steps); 
        ctxt.fillStyle = vsprintf('rgb(%s, %s, %s)', rgbArray);
        ctxt.arc(x+i, y+i, radius - i * 2, Math.PI * 180, true);  
	}
};


// Create rgb string with random values between 0 and 255.
// Relies on the open-source implementation of sprintf found in 
// 'sprintf-0.7-beta1.js' by Alexandru Marasteanu.
UTILITIES.getRandomColor = function () {
	var styleArray = [];
	for (var i = 0; i < 3; i++) {
		var randomValue = Math.floor(Math.random() * 256);
		styleArray.push(randomValue);
	}
	return vsprintf('rgb(%s, %s, %s)', styleArray);
};


// Draw 10 semi transparent rectangles inside a given rectangle with 
// position x, y and size w, h.
UTILITIES.gradateRectColor = function (ctx, parent_x, parent_y, parent_w, parent_h) {
	for (var i=0;i<10;i++){
		ctx.fillStyle = 'rgba(255,255,255,'+(i+1)/10+')';
		var border = Math.max(.05 * parent_w, .05 * parent_h);
		var child_w = (parent_w - (2 * border)) * .1;  
		var child_h = (parent_h - (2 * border)) * .90;
		var child_x = border + (i * child_w) + parent_x;
		var child_y = border + parent_y;
		ctx.fillRect(child_x, child_y, child_w, child_h);
	}
};


UTILITIES.gradateCircleColor = function (ctx, parent_x, parent_y, parent_radius) {
	//Draw border
	ctx.fillStyle = 'rgba(255,255,255,.5)';
	ctx.beginPath();		
	ctx.arc(parent_x, parent_y, parent_radius * .9, 0, Math.PI*2, true);
	ctx.fill();

	//Draw highlight
	ctx.lineWidth = 7;
	ctx.strokeStyle = 'rgb(255,255,255)';
	ctx.beginPath();		
	ctx.arc(parent_x, parent_y, parent_radius * .8, 0, 1.5 * Math.PI, true);
	ctx.stroke();
};


////----------------------------------------------------------------------
////-----Useful routines from Crockford's 'Javascript: The good parts'----
////----------------------------------------------------------------------


Function.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
};


//Object.method('superior', function (name) {
			//var that = this, 
				//method = that[name];
			//return function () {
				//return method.apply(that, arguments);
			//};
	//}
//); 


if (typeof Object.beget !== 'function') {
	Object.beget = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	};
}




////----------------------------------------------------------------------
////------------------ HTML5 Canvas-specific utilities --------------------
////----------------------------------------------------------------------



////---------------------- Bezier-curve utilities ------------------------
////----------------------------------------------------------------------


////------------- Make a Bezier Object from standard parameters ----------
UTILITIES.objectifyBezierCurve = function (startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY) {
	var curve = {
		'start': {
			'x': startX, 
			'y': startY, 
		}, 
		'cp1': {
			'x': cp1X, 
			'y': cp1Y
		}, 
		'cp2': {
			'x': cp2X, 
			'y': cp2Y		
		}, 
		'end': {
			'x': endX, 
			'y': endY		
		} 
	}; 
	return curve; 
}; 



////--------- Draw a Bezier curve from Bezier Object information ---------
UTILITIES.drawBezierCurveObject = function (bezierObject) {
	context.beginPath(); 
	// Lift and move the pen
	context.moveTo(bezierObject['start']['x'], bezierObject['start']['y']); 
	
	// Draw the curve 
	context.bezierCurveTo(bezierObject['cp1']['x'], bezierObject['cp1']['y'], 
						bezierObject['cp2']['x'], bezierObject['cp2']['y'], 
						bezierObject['end']['x'], bezierObject['end']['y']); 
	context.stroke(); 
	// return nothing...It's all side-effects.
}; 




////------------ Find the point at t percent of a cubic Bezier -----------
// From Wikipedia: 
//	cubicBezier(proportion) = (1 - proportion)^3 * startPt + 
		// 3 * (1 - proportion)^2 * proportion * cp1 + 
		// 3 * (1 - proportion) * proportion^2 * cp2 + 
		// proportion^3 * endPt
// @param -proportion- : a number in [0, 1]
// @param -bezierObject-: an object containing at least -start-, 
//		-cp1-, -cp2- and -end- 
UTILITIES.getPointInCubicBezier = function (proportion, bezierObject) {	
	proportion = proportion || 0.0; 
	bezierObject = bezierObject || {
		'start': {
			'x': 0, 
			'y': 0, 
		}, 
		'cp1': {
			'x': 0, 
			'y': 0
		}, 
		'cp2': {
			'x': 0, 
			'y': 0		
		}, 
		'end': {
			'x': 0, 
			'y': 0		
		} 
	}; 
	
	var start = bezierObject['start'], 
		cp1 = bezierObject['cp1'], 
		cp2 = bezierObject['cp2'], 
		end = bezierObject['end'];
						
	var scaledStart = {
		'x': Math.pow(1 - proportion, 3) * start['x'],
		'y': Math.pow(1 - proportion, 3) * start['y']
	};
	
	var scaledCp1 = {
		'x': 3 * Math.pow(1 - proportion, 2) * proportion * cp1['x'],
		'y': 3 * Math.pow(1 - proportion, 2) * proportion * cp1['y']
	};	
	
	var scaledCp2 = {
		'x': 3 * (1 - proportion) * Math.pow(proportion, 2) * cp2['x'],
		'y': 3 * (1 - proportion) * Math.pow(proportion, 2) * cp2['y']
	};	

	var scaledEnd = {
		'x': Math.pow(proportion, 3) * end['x'],
		'y': Math.pow(proportion, 3) * end['y']
	};
	
	var scaledPoint = {
		'x': scaledStart['x'] + scaledCp1['x'] + scaledCp2['x'] + scaledEnd['x'], 
		'y': scaledStart['y'] + scaledCp1['y'] + scaledCp2['y'] + scaledEnd['y'], 
	};

	context.beginPath();
	
	// Check path...
	// context.fillRect(scaledPoint['x'], scaledPoint['y'], 10, 10);	
	
	return scaledPoint;  
};


////---------------- Get the length of a cubic Bezier -------------------
// Divide a curve into piecewise-linear components, measure each
// one (i.e. get the 2-norm), and return the sum. 
// @param -bezierObject-: an object containing at least -start-, 
//		-cp1-, -cp2- and -end-
// @param -integer- : an integer indicating the number of piecewise-components
// 		to divide the curve into.  
UTILITIES.getCubicBezierLength = function (bezierObject, steps) { 
	
	var start = bezierObject['start'], 
		cp1 = bezierObject['cp1'], 
		cp2 = bezierObject['cp2'], 
		end = bezierObject['end'], 
		curveProportion, 
		currentPoint, 
		previousPoint = {
			'x': 0, 
			'y': 0
		}, 
		curveLength = 0.0;
		 
	steps = steps || 10; 
		
	for (var i = 1; i <= steps; i += 1) {
		curveProportion = i / steps; 
		currentPoint = UTILITIES.getPointInCubicBezier(curveProportion, bezierObject); 
		//console.log('currentPointX: ' + currentPoint['x'] + ' currentPointY: ' + currentPoint['y']); 
		if (i > 0) {
			var diffPoint = {
				'x': currentPoint['x'] - previousPoint['x'],
				'y': currentPoint['y'] - previousPoint['y']
			};
			curveLength += Math.sqrt(Math.pow(diffPoint['x'], 2) +  
								Math.pow(diffPoint['y'], 2)); 
		}
		previousPoint = currentPoint;   		
	}; 
	return curveLength; 
}; 
