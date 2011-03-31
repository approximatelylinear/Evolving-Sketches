var DRAWING = DRAWING || {}; 


DRAWING.addSmallPerturbation = function (item, range) {
	var lower = -(range/2),
		upper = range/2;
	return item + UTILITIES.getRandomInt(lower, upper); 
}; 



// Assumes that the calling function has called ctxt.beginPath before invoking showBranchStart().  
DRAWING.showBranchPoints = function (ctxt, branch) {
	var setupContextAndDisplay = function (coords, fillStyle) {
		ctxt.save();
		ctxt.fillStyle = fillStyle; 
		ctxt.fillRect(coords['x'], coords['y'], 6, 6); 
		ctxt.restore(); 		
	};
	setupContextAndDisplay(branch.start, 'rgb(255, 0, 0)'); 
	setupContextAndDisplay(branch.end, 'rgb(0, 200, 0)'); 
};



// Assumes that the calling function has called ctxt.beginPath before invoking showControlPoints().  
DRAWING.showControlPoints = function (ctxt, ctrlPoints) {
	ctxt.fillRect(ctrlPoints['c1']['x'] - 3, ctrlPoints['c1']['y'] - 3, 6, 6);
	ctxt.fillRect(ctrlPoints['c2']['x'] - 3, ctrlPoints['c2']['y'] - 3, 6, 6);
}; 


DRAWING.branch = {
	'start' : {
		'x': 0, 
		'y': 0
	},
	'end' : {
		'x': 0, 
		'y': 0,
	},
	'controlPoints' : {
		'c1': 0, 
		'c2': 0
	}, 						
	'energy': 0
}; // end DRAWING.branch



/**
 * @methodOf DRAWING
 * @param {Object} that 
 * @param {Object} secrets
 */
DRAWING.initBranch = function (that, secrets) {
	var that = that || {};
	var secrets = secrets || Object.beget(DRAWING.branch);

	var getStart = function () {  
		return this.start || secrets.start;
	};	
	
	var getEnd = function () {
		return this.end || secrets.end;
	}; 
	
	var getControlPoints = function () {
		return this.controlPoints || secrets.controlPoints;
	};		
	
	var getEnergy = function () {
		return this.energy || secrets.energy;
	};

	var setStart = function (start) {
		this.start = start; 
		return this;	
	};	
	
	var setEnd = function (end) {
		this.end = end; 

		// Add random perturbations
		for (var coord in this.end) {
			this.end[coord] = DRAWING.addSmallPerturbation(this.end[coord], 20);
		}
		
		return this;	
	}; 
	
	var setControlPoints = function () {
		this.controlPoints = DRAWING.setControlPoints(this);
		
		// Add random perturbations
		for (var cp in this.controlPoints) {
			this.controlPoints[cp]['x'] = DRAWING.addSmallPerturbation(this.controlPoints[cp]['x'], 20);	
			this.controlPoints[cp]['y'] = DRAWING.addSmallPerturbation(this.controlPoints[cp]['y'], 20);	
		}

		return this;
	};		
	
	var setEnergy = function (energy) {
		this.energy = energy;
		return this;	
	};
	
		
	// Getters
	that.getStart = getStart;
	that.getEnd = getEnd;
	that.getEnergy = getEnergy;
	that.getControlPoints = getControlPoints;
	
	// Setters
	that.setStart = setStart;
	that.setEnd = setEnd;
	that.setEnergy = setEnergy;
	that.setControlPoints = setControlPoints;
	
	return that;
}; // end DRAWING.initBranch




// Return centered control points
/**
 * @methodOf DRAWING
 * @param {Object} branch
 * @param {Method} branch.getStart()
 * @param {Method} branch.getEnd()
 */
DRAWING.setControlPoints = function (branch) {
	
	var xDist = branch.getEnd()['x'] - branch.getStart()['x'],
		controlPoints = {
		'c1': {
			'x': branch.getStart()['x'] + xDist / 4, 
			'y': branch.getStart()['y']
			}, 
		'c2': {
			'x': branch.getStart()['x'] + 3 * (xDist / 4), 
			'y': branch.getStart()['y']
		}			
	};
	return controlPoints;
};


/**
 * @methodOf DRAWING
 * @param {Object} start
 * @param {Number} energy   
 * @param {Number} start.x
 * @param {Number} start.y 
 */
DRAWING.setupBranches = function (start, energy) {
	// The (for now, two) branches have the same vertical component, but opposite horizontal components.
	
	var branchCost = 5,
		branches = [
			DRAWING.initBranch(),
			DRAWING.initBranch(), 	
		],
		b1End = {
			'x': start['x'] + energy,
			'y': start['y'] - energy
		}, 
		b2End = {
			'x': start['x'] - energy,
			'y': start['y'] - energy
		};

	branches[0].
		setStart(start).
		setEnd(b1End).
		setEnergy(energy - branchCost).
		setControlPoints(); 
	branches[1].
		setStart(start).
		setEnd(b2End).
		setEnergy(energy - branchCost).
		setControlPoints(); 
	
	return branches; 
}; 

		
		 
		
		
/**
 * @methodOf DRAWING
 * @param {Object} ctxt The 2d context of the HTML5 canvas object.
 * @param {Object} start
 * @param {Number} energy   
 * @param {Number} start.x
 * @param {Number} start.y 
 */
DRAWING.drawBranches = function (ctxt, branch) {
	var currStart = branch.getStart(),
		ctrlPoints = branch.getControlPoints(), 
		energy = branch.getEnergy(); 

	// Draw lines 1/10 thick as they are long.
	ctxt.lineWidth = energy/10; 
	ctxt.shadowColor = 'rgba(50, 50, 50, .4)'; 
	ctxt.shadowOffsetX = 8;
	ctxt.shadowOffsetY = 8;	
	ctxt.shadowBlur = 5; 
			
	// draw branches	
	ctxt.beginPath();
	
	//DRAWING.showBranchPoints(ctxt, branch); 
		
	// move back to start
	ctxt.moveTo(currStart['x'], currStart['y']);
		
	ctxt.bezierCurveTo(ctrlPoints['c1']['x'], 
		ctrlPoints['c1']['y'], 
		ctrlPoints['c2']['x'], 
		ctrlPoints['c2']['y'], 
		branch['end']['x'], branch['end']['y']);
		
	//DRAWING.showControlPoints(ctxt, ctrlPoints); 
		
	ctxt.stroke();
};


/**
 * @methodOf DRAWING
 * @param {Object} start The canvas x- and y-coordinates of the branch root.
 * @param {Number} energy  The amount of energy for growing available to the branch. 
 * @param {Number} start.x The canvas x-coordinate of the branch root.
 * @param {Number} start.y The canvas y-coordinate of the branch root.
 */	
DRAWING.getChildBranches = function (start, energy) {
	var childBranches = []; 
	if (energy > 0) {
		childBranches = DRAWING.setupBranches(start, energy);
	}
	return childBranches; 		
};


/**
 * @methodOf DRAWING
 * @param {Object} ctxt The 2d context of the HTML5 canvas object.
 * @param {Object} start The canvas x- and y-coordinates of the tree root. 
 * @param {Number} totalEnergy The amount of energy for growing available to the whole tree. Proportional to the number of canvas pixels the tree will occupy. 
 * @param {Number} start.x The canvas x-coordinate of the tree root.
 * @param {Number} start.y The canvas y-coordinate of the tree root.     
 */
DRAWING.drawTree = function (ctxt, start, totalEnergy) {
	// Keep only the left branch of first two childBranches starting from start. 
	var initialBranch =  DRAWING.getChildBranches(start, totalEnergy),
		nextBranches = initialBranch; //[initialBranch[0]];

	// Draw trunk
	ctxt.save()
	ctxt.beginPath();
	ctxt.shadowColor = 'rgba(50, 50, 50, .4)'; 
	ctxt.shadowOffsetX = 8;
	ctxt.shadowOffsetY = 8;	
	ctxt.shadowBlur = 5; 
	ctxt.moveTo(start['x'], start['y'] + totalEnergy * 4);
	ctxt.lineWidth = totalEnergy / 4; 
	ctxt.lineTo(start['x'], start['y']); 
	ctxt.stroke(); 
	ctxt.restore(); 
		
    /** @inner */ 
    var animateDrawing = function () {

		// If there are no more branches to draw, stop the routine  
		if (nextBranches.length < 1) {
			return;
		}

		// set -start- to first object in nextBranches, and remove that object from nextBranches.
		var currentBranch = nextBranches.pop();//, 
			currentEnergy = currentBranch.getEnergy(),
			nextBranchStart = currentBranch.getEnd(),
			
			console.log(currentEnergy); 
		// Then, add the children of -start- to -nextBranches- 
			newChildren = DRAWING.getChildBranches(nextBranchStart, currentEnergy); 

		for (var i = 0, newChildrenLength = newChildren.length; i < newChildrenLength; i += 1) {
			nextBranches.push(newChildren[i]);	
		}
		
		// Draw current branches
		DRAWING.drawBranches(ctxt, currentBranch)
		
		setTimeout(animateDrawing, 25);
		
	}; // end animateDrawing
	
	// Start animation
	setTimeout(animateDrawing, 300); 
};
