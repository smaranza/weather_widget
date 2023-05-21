// INIT SLIDER

class SLIDER {
    constructor() {
        this.threshold = 100;
        this.currentSlide = 0;
        this.infinite = true; //@NEXT implement options
        this.init()
    }
    
    init() {
        const $slider = $('[data-slider="true"]'),
              slideSelector = $($slider).data('slideTarget') || ".slide",
              $slides = $($slider).find(slideSelector),
              slideWidth = $($slides).innerWidth(); //@NEXT assume every slide has same width

        $slider
            .addClass('slider')
            .append($('<div class="slider__track"></div>'));
        
        this.$track = $slider.find('.slider__track');
        this.totalSlides = $slides.length;

        $slides
            .addClass('slider__slide')
            .appendTo($($slider).find('.slider__track'));

        this.$slider = $($slider);
        this.$slides = $slides;
        this.slideWidth = slideWidth;

        this.createNavigation()
        this.createPagination()
        
        this.registerEvents()
    }

    createNavigation() {
        this.$navigation = $('<div class="slider__navigation">')
            .append(
                this.$next = $('<div class="next"></div>'),
                this.$prev = $('<div class="prev"></div>')
            )
        
        this.$slider.append(this.$navigation)
    }

    createPagination() {
        let $pagination = $('<div>', {
            class: 'slider__pagination',
            html: '<ol class="dot__list"></ol>'
        })
        
        let $dotList = $($pagination).find('.dot__list');
        
        this.$slides.each((i) => {
            $('<li>', {
                class: 'dot__item',
                html: (i + 1).toString()
            }).appendTo($dotList)
        });
   
        this.$slider.append($pagination)
    }

    registerEvents() {
        let me = this,
            dragStart,
            dragEnd;

        this.$next.click(() => me.doSlide(-1) );
        this.$prev.click(() => me.doSlide(1) );

        $(this.$track).on('touchstart mousedown', function () {
            dragStart = event.targetTouches[0].clientX;
            dragEnd;

            $(this).on('touchmove mousemove', function () {
                dragEnd = event.targetTouches[0].clientX;
                $(me.$track).css('transform', `translateX(${dragStart - dragEnd}px)`)
            })
            
            $(this).on('touchend mouseup', function () {
                if ( Math.abs(dragStart - dragEnd) > me.threshold ) { 
                    me.doSlide( (dragStart - dragEnd) > 0 ? -1 : 1 )
                } else {
                    me.doSlide(0);
                }

                // reset event calcs
                dragStart = dragEnd = 0;
            })
        });
    }


    doSlide(direction) {
        $(document).off('mouseup')
        
        let newSlide = this.currentSlide + direction;

        if (this.infinite == true) {
            if (newSlide < -this.totalSlides + 1) newSlide = 0;
            if (newSlide > 0) newSlide = -this.totalSlides + 1;
        }

        $(this.$track)
            .off('mousemove')
            .css('transform', `translateX( ${(newSlide * this.slideWidth)}px)`);
    
        this.currentSlide = newSlide;
    }
}


export default SLIDER;