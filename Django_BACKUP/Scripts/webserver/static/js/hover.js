(function ($) {
    $.fn.hover = function (options) {
        $(this).each(function () {
            var $this = $(this);
            var opts = $.extend({}, $.fn.hover.defaults, options);
            var hoverText = $this.data("hover");
            if (hoverText != null) {
                var $hover = $("<div>").addClass("hover-text").html(hoverText);
                $this.addClass("hover").append($hover);
                var hoverWidth = $hover.outerWidth();
                var hoverHeight = $hover.outerHeight();
                var position = $this.position();
                var width = $this.outerWidth();
                $hover.css({
                    top: position['top'] - hoverHeight -15 ,
                    left: position['left'] + (width / 2) - (hoverWidth / 2)
                }).hide();
                $this.hoverIntent(
                    function () { $hover.fadeIn(); },
                    function () { $hover.fadeOut(); }
                );
            }
        });
        return $(this);
    }
    $.fn.hover.defaults = {
    };
})(jQuery);

$(document).ready(function () {
    $('[data-hover!=""]').hover();
});

!function (factory) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], factory) : "object" == typeof module && module.exports ? module.exports = factory(require("jquery")) : jQuery && !jQuery.fn.hoverIntent && factory(jQuery) }(function ($) { "use strict"; var cX, cY, _cfg = { interval: 100, sensitivity: 6, timeout: 0 }, INSTANCE_COUNT = 0, track = function (ev) { cX = ev.pageX, cY = ev.pageY }, compare = function (ev, $el, s, cfg) { if (Math.sqrt((s.pX - cX) * (s.pX - cX) + (s.pY - cY) * (s.pY - cY)) < cfg.sensitivity) return $el.off(s.event, track), delete s.timeoutId, s.isActive = !0, ev.pageX = cX, ev.pageY = cY, delete s.pX, delete s.pY, cfg.over.apply($el[0], [ev]); s.pX = cX, s.pY = cY, s.timeoutId = setTimeout(function () { compare(ev, $el, s, cfg) }, cfg.interval) }; $.fn.hoverIntent = function (handlerIn, handlerOut, selector) { var instanceId = INSTANCE_COUNT++, cfg = $.extend({}, _cfg); $.isPlainObject(handlerIn) ? (cfg = $.extend(cfg, handlerIn), $.isFunction(cfg.out) || (cfg.out = cfg.over)) : cfg = $.isFunction(handlerOut) ? $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector }) : $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut }); var handleHover = function (e) { var ev = $.extend({}, e), $el = $(this), hoverIntentData = $el.data("hoverIntent"); hoverIntentData || $el.data("hoverIntent", hoverIntentData = {}); var state = hoverIntentData[instanceId]; state || (hoverIntentData[instanceId] = state = { id: instanceId }), state.timeoutId && (state.timeoutId = clearTimeout(state.timeoutId)); var mousemove = state.event = "mousemove.hoverIntent.hoverIntent" + instanceId; if ("mouseenter" === e.type) { if (state.isActive) return; state.pX = ev.pageX, state.pY = ev.pageY, $el.off(mousemove, track).on(mousemove, track), state.timeoutId = setTimeout(function () { compare(ev, $el, state, cfg) }, cfg.interval) } else { if (!state.isActive) return; $el.off(mousemove, track), state.timeoutId = setTimeout(function () { !function (ev, $el, s, out) { delete $el.data("hoverIntent")[s.id], out.apply($el[0], [ev]) }(ev, $el, state, cfg.out) }, cfg.timeout) } }; return this.on({ "mouseenter.hoverIntent": handleHover, "mouseleave.hoverIntent": handleHover }, cfg.selector) } });
