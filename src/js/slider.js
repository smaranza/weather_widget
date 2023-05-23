class SLIDER {
    constructor(custom) {
        let defaults = {
            threshold: 20,
            initialSlide: 0,
            infinite: false,
            fixedWidth: true,
            draggingCls: "is__dragging",
            activeCls: "is__active",
            slideCls: "slide",
            noScrollCls: "no__scroll",
            transitionMs: 0,
        }

        this.dragStart;
        this.dragEnd;
        this.dragDelta = 0;
        this.opts = { ...defaults, ...custom };
        this.threshold = window.innerWidth / 100 * this.opts.threshold;
        this.currentSlide = this.opts.initialSlide;
        this.init()
    }


    /**
     * initialize slider components & functionality
     */
    init() {
        const $slider = $('[data-slider="true"]'),
              $slides = $($slider).find(`.${this.opts.slideCls}`);

        // standardize classes
        $slider.addClass('slider');
        $slides.addClass('slider__slide');
        $($slides[this.opts.initialSlide]).addClass(this.opts.activeCls);

        // initialize track with slides
        this.$track = $('<div>', {
            class: 'slider__track',
            html: $slides
        }).appendTo($slider);

        // initialize slide width for sliding calculation
        if (this.opts.fixedWidth) {
            this.slideWidth = $($($slides)[0]).outerWidth();
        } else {
            // @NEXT implement uneven slide width
        }

        // expose vars
        this.$slider = $($slider);
        this.$slides = $slides;
        this.totalSlides = $slides.length;

        // create template for slider UI
        this.createNavigation()
        this.createPagination()

        // register slider events
        this.registerEvents()
    }

    /**
     * Create template for pagination dots
     */
    createNavigation() {
        this.$navigation = $('<div class="slider__navigation">')
            .append(
                this.$next = $('<div class="next"></div>'),
                this.$prev = $('<div class="prev"></div>')
            )

        this.$slider.append(this.$navigation)
    }

    /**
     * Create template for pagination dots
     */
    createPagination() {
        let $pagination = $('<div>', {
            class: 'slider__pagination',
            html: this.$dotList = $('<ol class="dot__list"></ol>')
        })

        this.$slides.each((i) => {
            $('<li>', {
                class: 'dot__item ' + (i < 1 ? this.opts.activeCls : ""),
                target: i
            }).appendTo(this.$dotList)
        });

        this.$dotItems = this.$dotList.children();
        this.$slider.prepend($pagination)
    }

    /**
     * Returns an array of touches or a single mouse event.
     * unifies the touch/mouse gesturea.
     *
     * @param {jQuery.Event} event
     */
    registerEvents() {
        let me = this;

        // swipe controls
        $(me.$track).on('touchstart mousedown', me.onTouchStart.bind(me));

        // bind arrow buttons
        me.$next.click(() => me.handleSlide(-1));
        me.$prev.click(() => me.handleSlide(1));

        // bind paginations dots
        $(me.$dotItems).click((e) => {
            me.slideTo(- parseInt($(e.currentTarget).attr('target')));
        });

        // resize
        $(window).on('resize', me.onResize.bind(me));
    }

    /**
     * Returns an array of touches or a single mouse event.
     * unifies the touch/mouse gesturea.
     *
     * @param {jQuery.Event} event
     */
    getPointers(event) {
        let origEvent = event.originalEvent || event;
        return origEvent.touches || [origEvent];
    }

    /**
     * Called at touchstart/mousedown, registers drag starting point
     *
     * @param (jQuery.Event) event
     */
    onTouchStart(e) {
        let pointers = this.getPointers(e);
        this.currentLeft = $(this.$track).offset().left;

        if (pointers.length > 0) {
            $(this.$track).addClass(this.opts.draggingCls);

            let pointerA = pointers[0];
            this.dragStart = pointerA.clientX;

            // prevent vertical scroll when sliding
            $('body').addClass(this.opts.noScrollCls);

            $(this.$track).on('touchmove mousemove', this.onTouchMove.bind(this));
            $(this.$track).on('touchend mouseup', this.onTouchEnd.bind(this));
            $(window).on('mouseleave', this.onTouchEnd.bind(this));

            if (e.originalEvent instanceof MouseEvent && e.originalEvent.target instanceof HTMLImageElement) {
                e.preventDefault();
                return;
            }
        }
    }

    /**
     * Called at touchmove/mousemove, calculate dragging distance
     * + preview slide movement
     *
     * @param (jQuery.Event) event
     */
    onTouchMove(e) {
        let pointers = this.getPointers(e);

        if (pointers.length > 0 && $(this.$track).hasClass(this.opts.draggingCls)) {
            let pointerA = pointers[0];
            this.dragEnd = pointerA.clientX;
            this.dragDelta = this.dragStart - this.dragEnd;

            $(this.$track).css('transform', `translateX(${this.currentLeft - this.dragDelta}px)`);
        }
    }

    /**
     * Called at touchup/mouseup, returns dragging direction and magnitude
     */
    onTouchEnd() {
        $(this.$track).off('touchmove mousemove');

        if (Math.floor(this.dragDelta) == 0) {

            $('body').removeClass(this.opts.noScrollCls);
            $(this.$track).removeClass(this.opts.draggingCls)
            return
        }

        let direction = (Math.abs(this.dragDelta) < this.threshold)
            ? 0
            : (this.dragDelta > 0)
                ? -1
                : 1;

        this.handleSlide(direction);

        $(this.$track).off('touchend mouseup');
    }

    /**
     * updates slider variables
     */
    onResize() {
        this.threshold = window.innerWidth / 100 * this.opts.threshold;
        this.slideWidth = $($(this.$slides)[0]).outerWidth();
        this.handleSlide(0);
    }

    /**
     * Calculates target slide based on direction, calls slideTo(targetSlide)
     * @param (int) direction
     */
    handleSlide(direction) {
        let targetSlide = this.currentSlide + direction;

        if (this.opts.infinite == true) {
            if (targetSlide < -this.totalSlides + 1) targetSlide = 0;
            if (targetSlide > 0) targetSlide = -this.totalSlides + 1;
        }

        this.slideTo(targetSlide);
    }

    /**
     * Slides slider trackto calculated slide
     * @param (int) slide(index)
     */
    slideTo(slide) {
        $(this.$track).removeClass(this.opts.draggingCls)

        $(this.$track)
            .css('transform', `translateX( ${(slide * this.slideWidth)}px)`);

        this.currentSlide = slide;
        this.updatePagination(slide);

        // reset drag positions
        this.dragStart = this.dragEnd = this.dragDelta = 0;

        $(this.$slides).removeClass(this.opts.activeCls);
        $($(this.$slides)[Math.abs(slide)]).addClass(this.opts.activeCls);
    }

    /**
     * updates pagination dots, based on target slide
     * @param (int) target(index)
     */
    updatePagination(target) {
        this.$dotItems.removeClass(this.opts.activeCls);
        $(this.$dotItems[Math.abs(target)]).addClass(this.opts.activeCls);
    }
}

export default SLIDER;