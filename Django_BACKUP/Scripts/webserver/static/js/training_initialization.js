// design for extensibile search bar
$("#searchInput").focus(function () {

    $("#searchInput").css({

        "width": "100%",
        "border": "1px solid #40585d",
        "opacity": "1",
        "box-shadow": "0 0 1px black",
        "background-color": "#fff",
        "-webkit-box-shadow": "0 0 5 px black",
        "box-shadow": "0 0 5px black ",
    });

    $("#searchInput").prop("placeholder", "請輸入你所想要搜尋的文字，結果將會即時顯示 ...");
});

$(document).ready(function () {

});

$("#clickAll").click(function () {
    if ($("#clickAll").prop("checked")) {
        $(".form-check-input").each(function () {
            $(this).prop("checked", true);
            $(this).closest('.training_area').css({
                "background-color": "#C2DBFF",
            });
        });
    } else {
        $(".form-check-input").each(function () {
            $(this).prop("checked", false);
            $(this).closest('.training_area').css({
                "background-color": "transparent",
            });
        });
    }
});

$(".form-check-input").each(function () {
    $(this).click(function () {
        if ($(this).prop("checked")) {
            $(this).closest('.training_area').css({
                "background-color": "#C2DBFF",
                "font":"#fff",
            });
        } else {
            $(this).closest('.training_area').css({
                "background-color": "transparent",
                "font":"black",
            });
        }
    });
    
    
});