jQuery(function () {

    var $headerContainer = $('.header-container');

    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            if (!$headerContainer.hasClass('header-container_floating')) {
                $headerContainer.addClass('header-container_floating');
            }
        } else {
            if ($headerContainer.hasClass('header-container_floating')) {
                $headerContainer.removeClass('header-container_floating');
            }
        }
    });

    $('.menu-icon, .menu-close').click(function (event) {
        event.preventDefault();
        $('.menu-container').toggleClass('menu-container_opened');
    });

    $('.round-button_play').click(function (event) {
        event.preventDefault();
        $('body').prepend('<div class="video-player"><div class="video-player__block"><a class="video-player__close"></a><div class="video-player__wrapper"><iframe src="https://www.youtube.com/embed/5osJMAnzwkE" frameborder="0" allowfullscreen></iframe></div></div></div>');
        $('.video-player__close').click(function () {
            $(this).parents('.video-player').remove();
        });
    });

    $('.plan-text__switch-button').click(function () {
        $('.plan-text__switch-button').addClass('round-button_disabled');
        $(this).removeClass('round-button_disabled');
        $('.plan-item').removeClass('plan-primary').addClass('plan-secondary')
            .find('.round-button').removeClass('round-button_blue').addClass('round-button_thin-blue');
        $('.plan-item').eq($(this).index()).removeClass('plan-secondary').addClass('plan-primary')
            .find('.round-button').removeClass('round-button_thin-blue').addClass('round-button_blue');
    });

});

$(function () {
    $(".interface__slider").slick({
        centerMode: !0,
        centerPadding: "10px",
        slidesToShow: 3,
        responsive: [{
            breakpoint: 992,
            settings: {
                centerMode: !0,
                centerPadding: "40px",
                slidesToShow: 1
            }
        }, {
            breakpoint: 768,
            settings: {
                centerMode: !0,
                centerPadding: "40px",
                slidesToShow: 1
            }
        }, {
            breakpoint: 420,
            settings: {
                centerMode: !0,
                centerPadding: "0",
                slidesToShow: 1
            }
        },    {
                breakpoint: 340,
                settings: {
                    centerMode: !0,
                    centerPadding: "20px",
                    slidesToShow: 1
                      }
        }]
    }),  $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav'
      });
      $('.slider-nav').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: true,
        centerMode: true,
        focusOnSelect: true
      });
              
});