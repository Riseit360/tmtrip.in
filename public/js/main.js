// Mobile Click Drop Down
$('.dropnav > a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('active');
});

// toggle 
$(".nav-toggle").click(function () {
    $(this).toggleClass("on");
    $("nav").toggleClass("activated");
    $("nav").slideToggle();
});


// Sticy nav bar 
if ($(window).scrollTop() >= 300) {
    $('header').addClass('fixed-header');
} else {
    $('header').removeClass('fixed-header');

};


// whatsapp chat widget
var url = 'https://wati-integration-prod-service.clare.ai/v2/watiWidget.js?16297';
var s = document.createElement('script');
s.type = 'text/javascript';
s.async = true;
s.src = url;
var options = {
    "enabled": true,
    "chatButtonSetting": {
        "backgroundColor": "#007BFF",       // tmtrip blue
        "ctaText": "Need Help? Chat with us",
        "borderRadius": "25",
        "marginLeft": "0",
        "marginRight": "20",
        "marginBottom": "20",
        "ctaIconWATI": true,
        "position": "right"
    },
    "brandSetting": {
        "brandName": "TMTrip",
        "brandSubTitle": "Travel & Trip Assistance",
        "brandImg": "https://tmtrip.in/images/Tm-logo-white.png",
        "welcomeText": "Hello! 👋\nHow can we help you plan your trip?",
        "messageText": "Hi! I need help regarding Travel Booking / Flight / Hotel / Packages.",
        "backgroundColor": "#007BFF",
        "ctaText": "Chat Now",
        "borderRadius": "25",
        "autoShow": false,
        "phoneNumber": "8448325701"
    }
};

s.onload = function () {
    CreateWhatsappChatWidget(options);
};
var x = document.getElementsByTagName('script')[0];
x.parentNode.insertBefore(s, x);


//Tab Section 
$(document).ready(function () {
    $(".taclarsec").click(function () {
        $(".shomabodi").removeClass("active");
        $(".shomabodi[data-id='" + $(this).attr("data-id") + "']").addClass("active");
        $(".taclarsec").removeClass("active");
        $(this).parent().find(".taclarsec").addClass("active");
    });
});


// Popup
$(".popupbtnsec").on('click', function () {
    $(".custom-model-main").addClass('model-open');
});
$(".close-btn, .bg-overlay").click(function () {
    $(".custom-model-main").removeClass('model-open');
});