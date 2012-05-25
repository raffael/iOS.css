window.iOS = $.extend(window.iOS || {},{

	checkbox: function(checkboxElement){
	
		// the HTML structure which the <input /> will be placed into
		var structure	=	$('<div class="iOScheckbox on">'					// wrapper div
							+'		<div class="mobile">'						// the moving element that contains the blue and white elements
							+'			<span class="left">On</span>'			// the blue element (on)
							+'			<span class="right">Off</span>'			// the white element (off)
							+'		</div>'
							+'		<div class="inset-highlight left"></div>'	// a soft white highlight shown during on state
							+'		<div class="inset-highlight right"></div>'	// a soft white highlight shown during off state (they differ slightly)
							+'		<div class="inset-shadow"></div>'			// a soft inset shadow
							+'		<div class="mobile">'						// the div that contains the inner chip (actual UI element)
							+'			<i></i>'
							+'		</div>'
							+'		<div class="hidden-input">'					// the div that contains the hidden, embedded <input />
							+'		</div>'
							+'</div>');
		
		// insert the structure right after the <input />, then move the <input /> into the structure
		checkboxElement.after(structure);
		checkboxElement.appendTo(structure.find('.hidden-input'));
		
		var self		= structure,
			chip		= self.find('i'),										// the actual UI element (circle, chip)
			mobile		= self.find('.mobile'),									// all mobile elements
			transitionTime = 250,												// the duration [ms] of the mobile animation (has to be the same as specified in CSS)
			mobileOn	= -14,													// left &
			mobileOff	= -64,													// right position for the mobile elements in the on & off state
			x			= self.hasClass('on') ? mobileOn : mobileOff,
			stateOn		= self.hasClass('on'),
			touchStartX	= 0;													// stores the initial position when the user touch-and-holds
		
		var insetHighlightRightOpacity	= (stateOn) ? 0 : 1,
			insetHighlightLeft			= self.find('.inset-highlight.left'),
			insetHighlightRight			= self.find('.inset-highlight.right');
			resetHighlightOpacities();
		
		
		/**
		 * these variables are needed to track the user's interaction with the whole element:
		 * if the user touches the element shortly (tap), the full animation will be executed,
		 * that is, the element switches from on to off or vice versa,
		 * otherwise, if the user touches and holds the element, the user is dragging the element.
		 */
		var moveTriggerDelta,
			// the threshold after which the full mobile transition from on to off (v.v.) shall be exeuted
			moveTriggerThreshold = 2;											
		
		
		/**
		 * on touchstart, the moveTriggerDelta is reset and the touch start position is stored
		 */
		self.bind('touchstart', function(e){
			moveTriggerDelta = 0;
			touchStartX	= e.originalEvent.touches[0].clientX;

		/**
		 * on touchmove, the moveTriggerDelta will be incremented by the amount of movement
		 */
		}).bind('touchmove', function(e) {
		
			// track how much the user is moving on the element
			//moveTriggerDelta += e.originalEvent.touches[0].clientX+e.originalEvent.touches[0].clientY;
			moveTriggerDelta += Math.abs(e.originalEvent.touches[0].clientX - touchStartX);
			
			// add the touchActive class on the chip
			mobile.addClass('touchActive');
			
			// calculate the delta X since the touchstart event
			var isDragging = (moveTriggerDelta > moveTriggerThreshold);
			
			if (isDragging) {
				var deltaX	= e.originalEvent.touches[0].clientX - touchStartX;
				touchStartX = e.originalEvent.touches[0].clientX;
				x += deltaX;
				if (x<mobileOff) x = mobileOff;
				if (x>mobileOn) x = mobileOn;
				
				resetHighlightOpacities();
				
				// apply the movement (activates the :active state)
				mobile.css('-webkit-transform', 'translateX('+x+'px)');
			}
			
		/**
		 * on touchend, based on whether the users tapped or dragged,
		 * the full transitions will be executed or the chip will be moved
		 * to the right side, based on how much the user has dragged so far.
		 */
		}).bind('touchend', function(){
			mobile.removeClass('touchActive');
			
			var userTapped = (moveTriggerDelta < moveTriggerThreshold);
			
			if (userTapped) {
				/**
				 * user did not move a lot, so trigger a 'tap' event:
				 * add the transition class the enable transform transitions,
				 * invert the state (on/off),
				 * re-set the position of the chip,
				 * set up a timer to trigger the removal of the transition class
				 */
				mobile.addClass('transitions');
				self.toggleClass('on');
				stateOn = !stateOn;
				x			= self.hasClass('on') ? mobileOn : mobileOff;
				mobile.css('-webkit-transform', 'translateX('+x+'px)');
				setTimeout(function(){
					mobile.removeClass('transitions');
				}, transitionTime);
				
				var timeOut = (!stateOn) ? 250 : 1;
				setTimeout(function() {
					resetHighlightOpacities();
				}, timeOut);
			} else {
				/**
				 * user is actually moving the mobile element,
				 * check on which side the mobile element is more
				 * and trigger the transitioned movement
				 */
				mobile.addClass('transitions');
				var newStateIsOff = (x<-39);
				
				if (newStateIsOff) x = mobileOff;
				else x = mobileOn;
				
				if (stateOn && newStateIsOff || !stateOn && !newStateIsOff) {
					self.toggleClass('on');
					stateOn = !stateOn;
				}
				
				mobile.css('-webkit-transform', 'translateX('+x+'px)');
				setTimeout(function(){
					mobile.removeClass('transitions');
					resetHighlightOpacities();
				}, transitionTime);
			}
		});
		
		function resetHighlightOpacities() {
			insetHighlightRightOpacity = (x-mobileOn)/(mobileOff - mobileOn);
			insetHighlightLeft.css('opacity',  1-insetHighlightRightOpacity);
			insetHighlightRight.css('opacity',   insetHighlightRightOpacity);
		}
			
	}
});
