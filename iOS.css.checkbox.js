var iOS = {

	checkbox: function(checkboxElement){		
		var structure	=	$('<div class="iOScheckbox on">'
							+'		<div class="mobile">'
							+'			<span class="left">On</span>'
							+'			<span class="right">Off</span>'
							+'		</div>'
							+'		<div class="inset-highlight"></div>'
							+'		<div class="inset-highlight right"></div>'
							+'		<div class="inset-shadow"></div>'
							+'		<div class="mobile">'
							+'			<i></i>'
							+'		</div>'
							+'		<div class="hidden-input">'
							+'		</div>'
							+'</div>');
		
		checkboxElement.after(structure);
		checkboxElement.appendTo(structure.find('.hidden-input'));
		
		var self		= structure,
			circle		= self.find('i'),
			mobile		= self.find('.mobile');
			mobileOn	= -14,
			mobileOff	= -64,
			x			= self.hasClass('on') ? mobileOn : mobileOff,
			touchStartX	= 0;
		
		
		var moveTriggerDelta,
			moveTriggerThreshold = 3;
				
		self.bind('touchstart', function(e){
			moveTriggerDelta = 0;
			touchStartX	= e.originalEvent.touches[0].clientX;

		}).bind('touchmove', function(e) {
		
			// track how much the user is moving on the element
			moveTriggerDelta += e.originalEvent.touches[0].clientX+e.originalEvent.touches[0].clientY;
			
			// add the touchActive class on the circle
			circle.addClass('touchActive');
			
			// calculate the delta X since the touchstart event
			if (moveTriggerDelta > moveTriggerThreshold) {
				var deltaX	= e.originalEvent.touches[0].clientX - touchStartX;
				touchStartX = e.originalEvent.touches[0].clientX;
				x += deltaX;
				if (x<mobileOff) x = mobileOff;
				if (x>mobileOn) x = mobileOn;
				
				// apply the movement
				mobile.css('-webkit-transform', 'translateX('+x+'px)');
			}
		}).bind('touchend', function(){
			circle.removeClass('touchActive');
			
			if (moveTriggerDelta < moveTriggerThreshold) {
				// user did not move a lot, so trigger a 'click' event
				mobile.addClass('transitions');
				self.toggleClass('on');
				x			= self.hasClass('on') ? mobileOn : mobileOff;
				mobile.css('-webkit-transform', 'translateX('+x+'px)');
				setTimeout(function(){
					mobile.removeClass('transitions');
				}, 200);
			} else {
				/**
				 * user is actually moving the mobile element,
				 * check on which side the mobile element is more
				 * and trigger the transitioned movement
				 */
				mobile.addClass('transitions');
				if (x<-39) x = mobileOff;
				else x = mobileOn;
				mobile.css('-webkit-transform', 'translateX('+x+'px)');
				setTimeout(function(){
					mobile.removeClass('transitions');
				}, 200);
			}
		});
			
	}
};
