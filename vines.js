var DRAWING = DRAWING || {}; 

/**
 * @methodOf DRAWING
 * @param {Object} ctxt The 2d context of the HTML5 canvas object.
 * @param {Object} currentBranch  
 */
DRAWING.drawLeaf = function (ctxt, currentBranch) {	
	
	var parameters = DRAWING.setLeafStyle(currentBranch), 
		styleParams = parameters['styleParams'], 
		positionParams = parameters['positionParams'],
		paramQuantity = styleParams.length; 
	
	ctxt.beginPath();
	for (var i = 0; i < paramQuantity; i += 1) {
		DRAWING.drawLeafLayer(ctxt, styleParams[i], positionParams[i]); 
	} 
}; 



/**
 * @methodOf DRAWING
 * @param {Object} styleObject 
 * @param {String} styleType 
*/
DRAWING.getColorString = function (styleObject, styleType) {
	var colorString; 
	if (styleObject[styleType]) {
		colorString = 'rgba(' + styleObject[styleType]['red'] + '%,' + 
			styleObject[styleType]['green'] + '%,' + 
			styleObject[styleType]['blue'] + '%,' +
			styleObject[styleType]['alpha'] + ')'
	}
	else { colorString = 'rgb(50%, 50%, 50%, .5)'};
	return colorString; 
};


DRAWING.getGeometricObject = function (positionParam, positionParamType, ctxt) {
	var geomObj = {
		'arc': function () {
				ctxt.arc(positionParam['x'], 
						positionParam['y'], 
						positionParam['radius'], 
						positionParam['startAngle'], 
						positionParam['endAngle'], 
						positionParam['counterClockwise']);
		},  
		'line': function () {
			ctxt.moveTo(positionParam['start']['x'], positionParam['start']['y']); 
			ctxt.lineTo(positionParam['end']['x'], positionParam['end']['y']);
		}
	}
	console.log(geomObj[positionParamType]);
	return geomObj[positionParamType]; 
}; 
	
		
/**
 * @param {Object} ctxt The 2d context of the HTML5 canvas object.
 * @param {Object} styleParam 
 * @param {Object} positionParam  
 * @param {Object} styleParam.strokeStyle
 * @param {Object} styleParam.strokeStyle.lineWidth
 * @param {Number} styleParam.strokeStyle.red
 * @param {Number} styleParam.strokeStyle.green
 * @param {Number} styleParam.strokeStyle.blue
 * @param {Number} styleParam.strokeStyle.alpha
 * @param {Number} styleParam.fillStyle.red
 * @param {Number} styleParam.fillStyle.green
 * @param {Number} styleParam.fillStyle.blue
 * @param {Number} styleParam.fillStyle.alpha
 * @param {String} positionParam.type
 * @param {Number} positionParam.x
 * @param {Number} positionParam.y
 * @param {Number} positionParam.radius
 * @param {Number} positionParam.startAngle
 * @param {Number} positionParam.endAngle
 * @param {Number} positionParam.counterClockwise
 * @param {Object} positionParam.start
 * @param {Object} positionParam.end
 * @param {Number} positionParam.start.x
 * @param {Number} positionParam.start.y
 * @param {Number} positionParam.end.x 
 * @param {Number} positionParam.end.y 
*/
DRAWING.drawLeafLayer = function (ctxt, styleParam, positionParam) {
	//ctxt.beginPath(); 
	ctxt.save();
	
	var strokeColor = DRAWING.getColorString(styleParam, 'strokeStyle') ||
		'rgb(50%, 50%, 50%, .5)',  
		fillColor = DRAWING.getColorString(styleParam, 'fillStyle') ||
		'rgb(50%, 50%, 50%, .5)',
		shadowColor = DRAWING.getColorString(styleParam, 'shadowColor') ||
		'rgb(50%, 50%, 50%, 0)',
		shadowOffsetX = styleParam['shadowOffsetX'] || 0, 
		shadowOffsetY = styleParam['shadowOffsetY'] || 0,
		shadowBlur = styleParam['shadowBlur'] || 0,
		lineWidth = styleParam['lineWidth'] || 1; 
		
	ctxt.strokeStyle = strokeColor; 
	ctxt.fillStyle = fillColor; 
	ctxt.shadowColor = shadowColor; 
	ctxt.shadowOffsetX = shadowOffsetX;
	ctxt.shadowOffsetY = shadowOffsetY;	
	ctxt.shadowBlur = shadowBlur; 
	ctxt.lineWidth = lineWidth; 

	// Determine shapes
	var shapeFnc = DRAWING.getGeometricObject(positionParam, positionParam['type'], ctxt); 

	shapeFnc.apply(null);  
	
	// Draw shapes
	ctxt.stroke(); 
	ctxt.fill(); 
	ctxt.restore();
};



/**
 * @methodOf DRAWING
 * @param {Object} ctxt The 2d context of the HTML5 canvas object.
 * @param {Object} currentBranch
 * @param {Number} currentBranch.alpha
 * @param {Number} currentBranch.x
 * @param {Number} currentBranch.y
 * @param {Number} currentBranch.depth 
 * @param {Number} currentBranch.w 
 * @param {Number} currentBranch.v  
 * @param {Number} currentBranch.dx    
 * @param {Number} currentBranch.dy
 */
DRAWING.setLeafStyle = function (currentBranch) {
	
	var w = currentBranch['w'], 
		v = currentBranch['v'],
		dx = currentBranch['dx'], 
		dy = currentBranch['dy'];
		
	// Line between leaves
	var branchStyleParam = {
		'strokeStyle': {
			'red': 80 - v * 8, 
			'green': 40,
			'blue': 80 + v * 8, 
			'alpha': currentBranch['alpha']
		}, 
		'lineWidth': (currentBranch['depth'] + 1) * 0.5, 
		'shadowBlur': 5,
		'shadowColor': {
			'red': 40, 
			'green': 40,
			'blue': 40, 
			'alpha': .4
		},
		'shadowOffsetX': 8, 
		'shadowOffsetY': 8, 		 
	}; 
	 
	var branchPositionParam = {
		'type': 'line', 
		'start': { 
			'x': currentBranch['x'], 
			'y': currentBranch['y']
		}, 
		'end': {
			'x': dx, 
			'y': dy
		}
	}; 

	// Colored oval.
	var colorStyleParam = {
		'fillStyle': {
			'red': 80 + v * 8, 
			'green': 80 - v * 8,
			'blue': 80, 
			'alpha': currentBranch['alpha'] * 0.5
		}, 
		'lineWidth': (currentBranch['depth'] + 1) * 0.25, 
		'shadowColor': {
			'red': 40, 
			'green': 40,
			'blue': 40, 
			'alpha': .4
		},
		'shadowBlur': 5,
		'shadowOffsetX': 8, 
		'shadowOffsetY': 8, 
	}; 

	var colorPositionParam = {
		'type': 'arc', 
		'x': currentBranch['x'] - w/6, 
		'y': currentBranch['y'] - w/6, 
		'radius': w/3, 
		'startAngle': 0, 
		'endAngle': Math.PI * 2, 
		'counterClockwise': true
	}; 

	return {
		'styleParams': [
			branchStyleParam, 
			colorStyleParam
		],	
		'positionParams': [
			branchPositionParam, 
			colorPositionParam
		]
	}; 
}; 



/**
 * @methodOf DRAWING
 * @param {Object} ctxt The 2d context of the HTML5 canvas object.
 * @param {Object} currentBranch
 * @param {Number} currentBranch.alpha
 * @param {Number} currentBranch.x
 * @param {Number} currentBranch.y
 * @param {Number} currentBranch.depth 
 * @param {Number} currentBranch.w 
 * @param {Number} currentBranch.v  
 * @param {Number} currentBranch.dx    
 * @param {Number} currentBranch.dy
 */
DRAWING.addBranch = function (currentBranch, nextBranches) {
	nextBranches.push({
		'x': currentBranch['x'],
		'y': currentBranch['y'],
		'angle': currentBranch['angle'], 
		'depth': currentBranch['depth'] -= 1,  
		'alpha': currentBranch['alpha']
		});
	return nextBranches; 
}; 


/**
 * @methodOf DRAWING
 * @param {Object} params
 * @param {Object} params.ctxt The 2d context of the HTML5 canvas object.
 * @param {Array} params.nextBranches
 * @param {Number} params.alpha
 * @param {Number} params.angle
 * @param {Number} params.randomDepth 
 * @param {Number} params.w 
 * @param {Number} params.decay  
 */
DRAWING.setupBranch = function (params) {
	var ctxt = params['ctxt'],  
		w = params['w'],
		nextBranches = params['nextBranches'], 
		randomDepth = params['randomDepth'], 
		alpha = params['alpha'],
		decay = params['decay'], 
		//angle = params['angle'], 
		i = 0, 
		drawingQueue = [];


	// set -currentBranch- to first object in nextBranches, and remove that object from nextBranches.
	var currentBranch = nextBranches.pop();

	for (var i = 0; i <= randomDepth; i += 1) {
		var v = currentBranch['depth'] / 5.0; 
		currentBranch['alpha'] -= i * decay;
		currentBranch['alpha'] = Math.max(0, currentBranch['alpha']);		

		if (currentBranch['alpha'] > 0) {
			// Determine the next direction to grow in.
			// This is between -60 and 60 degrees of the current bearing.
							
			currentBranch['angle'] += UTILITIES.getRandomInt(-60, 60);
			var dx = currentBranch['x'] + Math.cos(Math.PI/180 * currentBranch['angle']) * w;
			var dy = currentBranch['y'] + Math.sin(Math.PI/180 * currentBranch['angle']) * w;

			currentBranch['dx'] = dx;
			currentBranch['dy'] = dy;
			currentBranch['w'] = w;
			currentBranch['v'] = v; 

			var branchInfo = {
				'x': currentBranch['x'], 
				'y': currentBranch['y'], 
				'dx': dx, 
				'dy': dy,
				'w': w,  
				'v': v, 
				'angle': currentBranch['angle'], 
				'alpha': currentBranch['alpha'], 
				'depth': currentBranch['depth'], 
				'decay': decay 
			}
			
			drawingQueue.push(branchInfo); 

			// Create a successor branch with reduced depth.
			if (Math.random() > 0.8 && currentBranch['depth'] > 0) {
				nextBranches.push({
					'x': currentBranch['x'],
					'y': currentBranch['y'],
					'angle': currentBranch['angle'], 
					'depth': currentBranch['depth'] -= 1,  
					'alpha': currentBranch['alpha']
					}); 
			}
			
			currentBranch['x'] = dx;
			currentBranch['y'] = dy;
		}
	}
		
			
	// Create a successor branch with reduced depth.
	if (currentBranch['depth'] > 0) {
		DRAWING.addBranch(currentBranch, nextBranches); 
	}
	
	return drawingQueue; 
}; 


/**
 * @methodOf DRAWING
 * @param {Object} params An object containing the parameters necessary for drawing a branch. 
 * @param {Object} params.ctxt The 2d context of the HTML5 canvas object.
 * @param {Number} params.w
 * @param {Array} params.nextBranches
 * @param {Number} params.randomDepth
 * @param {Number} params.alpha
 * @param {Number} params.decay
 * @param {Number} params.angle
 */
DRAWING.drawBranch = function (params) {
	var drawingQueue = DRAWING.setupBranch(params); 
	
	/** @inner */ 
    var animateDrawing = function () {
		if (drawingQueue.length > 0) {
			currentBranch = drawingQueue.pop();
			DRAWING.drawLeaf(params['ctxt'], currentBranch); 		
			setTimeout(animateDrawing, 100);
		}
		
		else {
			return;
		}
	}; // end animateDrawing
	
	// Start animation
	setTimeout(animateDrawing, 100); 
};



// Recursive root branches to smaller roots.
/**
 * @methodOf DRAWING
 * @param {Object} ctxt The 2d context of the HTML5 canvas object.
 * @param {Number} x
 * @param {Number} y  
 * @param {Number} angle    
 * @param {Number} depth
 * @param {Number} alpha
 * @param {Number} decay
 */
DRAWING.root = function (ctxt, x, y, angle, depth, alpha, decay) {    
    angle = angle || 0;
    depth = depth || 5;
    alpha = alpha || 1.0;
    decay = decay || 0.005;
    
    var w = depth*2, 
		randomDepth = depth * UTILITIES.getRandomInt(10,20),
		currentBranch, 
		nextBranches = [{
			'x': x, 
			'y': y, 
			'angle': angle, 
			'depth': depth, 
			'alpha': alpha 
			}]; 
	
    /** @inner */ 
    var animateDrawing = function () {
		if (nextBranches.length > 0) {
			DRAWING.drawBranch({
				'ctxt': ctxt,
				'w': w, 
				'nextBranches': nextBranches, 
				'randomDepth': randomDepth, 
				'alpha': alpha,
				'decay': decay, 
				'angle': angle 
			}); 			
			setTimeout(animateDrawing, 300);
		}
		
		else {
			return;
		}
	}; // end animateDrawing
	
	// Start animation
	setTimeout(animateDrawing, 100); 
};
