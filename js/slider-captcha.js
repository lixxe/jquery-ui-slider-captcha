(function( $ ) {

	$.fn.sliderCaptcha = function( options ) {

		var settings = $.extend( true, {}, $.fn.sliderCaptcha.defaults, options );

		return this.each(function() {

			var s = settings, 
				$this = $( this ),
				$form = $this.closest( "form" );

			// Disable input submit form
			if ( $form.length && $form.find( 'input[type="submit"]' ) )
				$form.find( 'input[type="submit"]' ).attr('disabled','disabled');

			// Start slider criation
			$this.addClass( 'slider_captcha' ).width( s.styles.width ).height( s.styles.height ).css( 'background', s.styles.backgroundcolor );

			if ( s.type == "filled") {
				if ( s.textfeedbackanimation == "overlap") {
				
				}
				$this.append(
					$( '<span>' ).append( $( '<span>' ).text( s.hinttext ) ).data( 'animation-type', s.textfeedbackanimation ).data( 'text-color-unlocked', s.styles.unlocktextcolor ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ) ).append(
					$( '<div>' ).addClass( 'swipe-knob ui-draggable type_filled' ).css( {'background': s.styles.knobcolor, 'left': s.styles.height } ).height( s.styles.height ).append(
					$( '<span>' ).data( 'top-end', s.face._top_end ).data( 'right-end', s.face._right_end ).addClass( 'knob_face' ).css({ 'top': s.face._top_start , 'right': s.face._right_start }) ) );

					$this.find( 'span > span' ).css( 'left', $this.get(0).getBoundingClientRect().width / 2 - $this.find( 'span > span' ).get(0).getBoundingClientRect().width / 2 );
			} else {
				$this.append(
					$( '<span>' ).data( 'text-color-unlocked', s.styles.unlocktextcolor ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ).text( s.hinttext ) ).append( 
					$( '<div>' ).addClass( 'swipe-knob ui-draggable' ).css( 'background', s.styles.knobcolor ).height( s.styles.height ).append(
					$( '<span>' ).addClass( 'knob_face' ) ) );
					// _top_end and _right_end end only matters for filled slider type
			}

			if ( s.face.entypo_start.length )
				$this.find( '.swipe-knob' ).data( 'start-icon', s.face.entypo_start ).addClass( 'icon-' + s.face.entypo_start );

			if ( s.face.entypo_end.length )
				$this.find( '.swipe-knob' ).data( 'end-icon', s.face.entypo_end );

			$this.find( '.knob_face' ).css( 'color', s.face.text_color_start ).data( 'end-text-color',  s.face.text_color_end );
			$this.data( 'events', s.events ).append( $( '<div>' ).addClass( 'knob-destiny' ).data( 'disabled-knobcolor', s.styles.disabledknobcolor ).width( s.styles.height ).height( s.styles.height ) ).data( 'form', $form);


			// Finished slider criation

			$this.find( '.swipe-knob' ).draggable({
				containment: "parent", 
				scrollSpeed: 70,
				axis: 'x',
				cursor: 'move',
				revert: 'invalid',
				zIndex: '1',
				drag: function ( event, ui ) {

					if ( $( this ).parent().find( 'span > span' ).parent().data( 'animation-type' ) ) {

						var $slider_elem = $( this ).parent(),
							slider_elem_coord = $slider_elem.get(0).getBoundingClientRect(),
							$feedback_elem = $slider_elem.find( 'span > span' ),
							feedback_elem_coord = $feedback_elem.get(0).getBoundingClientRect(),
							feedback_elem_x;

						if ( 'swipe_overlap' == $feedback_elem.parent().data( 'animation-type' ) ) {
							// swipe_overlap
							if ( ( slider_elem_coord.width - feedback_elem_coord.width ) / 2 > ui.offset.left ) {
								feedback_elem_x = ( slider_elem_coord.width - feedback_elem_coord.width ) / 2;
							} else if ( 10 + ui.offset.left + feedback_elem_coord.width > slider_elem_coord.width ) {
								feedback_elem_x = slider_elem_coord.width - feedback_elem_coord.width - 10;
							} else {
								feedback_elem_x = ui.offset.left;
							}
							$feedback_elem.css( 'left', feedback_elem_x );
						} else if( 'swipe' == $feedback_elem.parent().data( 'animation-type' ) ) {
							// swipe
							feedback_elem_x = feedback_elem_x = ( ( slider_elem_coord.width - feedback_elem_coord.width ) / 2 < ui.offset.left ) ? ui.offset.left : ( slider_elem_coord.width - feedback_elem_coord.width ) / 2;
							$feedback_elem.css( 'left', feedback_elem_x );
						}
					
					}

				},
				stop: function( event, ui ) {
					if ( $( this ).parent().find( 'span > span' ).parent().data( 'animation-type' ) ) {

						$( this ).parent().find( 'span > span' ).animate({
							'left': $( this ).parent().get(0).getBoundingClientRect().width / 2 - $( this ).parent().find( 'span > span' ).get(0).getBoundingClientRect().width / 2
						}
						, 200);

					}
				},
				start: function( event, ui ) {
					console.log( 'Started' );
				}
			});

			$this.find( '.knob-destiny' ).droppable({
				acccept: '.swipe-knob',
				tolerance: 'pointer',
				drop: function(event, ui) {

					var events = $( this ).parent().data( 'events' ),
						$slider_elem = $( this ).parent(),
						$slider_text_elem = $slider_elem.find( 'span:eq(0)' ),
						$drag_elem = $( ui.draggable ),
						$drop_elem = $( this ),
						$form = $slider_elem.data( 'form' );


					if ( $drag_elem.find( '.knob_face' ).data( 'end-text-color' ) )
						$drag_elem.find( '.knob_face' ).css( 'color', $drag_elem.find( '.knob_face' ).data( 'end-text-color' ) );

					if ( $drag_elem.data( 'end-icon' ) ) {

						if ( $drag_elem.data( 'start-icon' ) )
							$drag_elem.removeClass( 'icon-' + $drag_elem.data( 'start-icon' ) );

						$drag_elem.addClass( 'icon-' + $drag_elem.data( 'end-icon' ) );

						if ( $drag_elem.find( 'span' ).data( 'top-end' ) )
							$drag_elem.find( 'span' ).css( 'top', $drag_elem.find( 'span' ).data( 'top-end' ) );

						if ( $drag_elem.find( 'span' ).data( 'right-end' ) )
							$drag_elem.find( 'span' ).css( 'right', $drag_elem.find( 'span' ).data( 'right-end' ) );
					}

					// Event before unlock
					if ( events['beforeUnlock'] && typeof( events['beforeUnlock'] ) == "function" )
						events['beforeUnlock'].apply();

					if( s.text_after_unlock.length )
						$slider_text_elem.text( $slider_text_elem.data( 'text-unlocked' ) );

					$drop_elem.droppable( "option", "disabled", true );
					$slider_text_elem.css( { 'z-index': 2, 'color': $slider_text_elem.data( 'text-color-unlocked' ) } );
					$drag_elem.addClass( 'swipe_ended' ).css( { 'left': 'auto', 'background': $drop_elem.data( 'disabled-knobcolor' ) } ).draggable({ disabled: true });

					// Event after unlock
					if ( events['afterUnlock'] && typeof( events['afterUnlock'] ) == "function" )
						events['afterUnlock'].apply();

					if ( $form.length ) {

						if ( events['validateOnServer'] )
							$form.append( $( '<input>' ).attr( 'type', 'hidden' ).attr( 'name', 'slider_captcha_validated' ).val( 1 ) );
						
						$form.find( 'input[type="submit"]' ).removeAttr( 'disabled' ).click( function () {
							// Event before submit
							if ( events['beforeSubmit'] && typeof( events['beforeSubmit'] ) == "function" )
								events['beforeSubmit'].apply();

						});

						if ( events['submitAfterUnlock'] )
							$form.submit();
					}
				}
			})
		});
	};

	// Plugin defaults
	$.fn.sliderCaptcha.defaults = {
		type: 'normal',
		textfeedbackanimation: 'overlap',
		styles: {
			knobcolor: '',
			disabledknobcolor: '#5CDF3B',
			backgroundcolor: '',
			textcolor: '',
			unlocktextcolor: '#fff',
			width: '100%',
			height: ''
		},

		hinttext: 'Slide to Unlock',
		hinttext_size: '',
		text_after_unlock: 'You rock!',
		events: {
			beforeUnlock: function() {},
			afterUnlock: function() {},
			beforeSubmit: function() {},
			submitAfterUnlock: 0,
			validateOnServer: 0
		},
		
		face: {
			// todo image face
			image: '',
			_top_start: '',
			_right_start: '',
			_top_end: '',
			_right_end: '',
			entypo_start: '',
			entypo_end: '',
			text_color_start: '',
			text_color_end: ''
		},

	};

}( jQuery ));