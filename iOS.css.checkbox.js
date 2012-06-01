/*
 * iOS.css Checkboxes (JS) v1.0
 * http://www.raffael.me/iOS.css/
 * http://github.com/raffael-me/iOS.css/
 *
 * Copyright (c) 2012 Raffael Hannemann
 * Dual licensed under the MIT.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

/**
 * Checkbox: Usage
 * (1) Add any variation of an <input type="checkbox" /> tag to your HTML
 * (2) Apply the iOS.checkbox() method on the jQuery result:
 *		iOS.checkbox($('input[type="checkbox"]));
 * (3) No third step.
 *
 * NOTE: The input only reacts on touch events. Use the Phantom Limb lib or something similar to simulate touch events on Desktop browsers.
 */

(function(){

	if (typeof jQuery == 'undefined') {
		throw "iOS.css: jQuery not found. Be sure to inject jQuery before loading iOS.css";
		return null;
	}
	
	window.iOS = $.extend( (typeof window.iOS != 'undefined') ? window.iOS:{}, {
	
		checkbox: function(checkboxElements){
			checkboxElements.each(function(){
				var checkboxElement = $(this);
				
				// the HTML structure which the <input /> will be placed into
				var structure	=	$('<div class="iOScheckbox">'					// wrapper div
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
				
				// check if input is checked by default and add the appropriate class
				if (checkboxElement.is(':checked')) structure.addClass('on');
				
				var self		= structure,
					chip		= self.find('i'),										// the actual UI element (circle, chip)
					mobile		= self.find('.mobile'),									// all mobile elements
					transitionTime = 250,												// the duration [ms] of the mobile animation (has to be the same as specified in CSS)
					mobileOn	= -14,													// left &
					mobileOff	= -64,													// right position for the mobile elements in the on & off state
					x			= self.hasClass('on') ? mobileOn : mobileOff,
					stateOn		= self.hasClass('on'),
					touchStartX	= 0,													// stores the initial position when the user touch-and-holds
					touchStartTime;														// timestamp of touch start event
				
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
					// the time threshold before which the full mobile transition from on to off (v.v.) shall be exeuted
				var isDraggingTimeThreshold		= 120;											
				
				/**
				 * on touchstart, the touchStartTime is reset to the current timestamp and the
				 * touch start position is stored
				 */
				self.bind('touchstart', function(e){
					touchStartX	= e.originalEvent.touches[0].clientX;
					touchStartTime = new Date();
		
				/**
				 * on touchmove, the touchStartTime will be compared to the current time,
				 * if the ellapsed time is higher than the isDraggingTimeThreshold, the user
				 * seems to be dragging the element, instead of just tapping it.
				 */
				}).bind('touchmove', function(e) {
								
					// add the touchActive class on the chip
					mobile.addClass('touchActive');
					
					// calculate the delta X since the touchstart event
					var isDragging = (new Date() - touchStartTime > isDraggingTimeThreshold);
					
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
	
					var userTapped = (new Date() - touchStartTime < isDraggingTimeThreshold);
					
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

			}); // each
				
		}
	}); // $.extend();

})(); // scope;
