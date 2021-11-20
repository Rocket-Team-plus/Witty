$(document).ready(function () {

    let t = set_datatable("table_comment");

    //網站初始化設定
    init();

    //取得資料
    get_data(t);
    
    adding_simple_focus_event();
    
});

function adding_simple_focus_event(){
    $(".form-select").each(function () {
        $(this).addClass("simple-focus")
    });
    $("input").each(function () {
        $(this).addClass("simple-focus")
    });
    $(".data-content").each(function () {
        $(this).addClass("simple-focus")
    });
    $(".help-img").each(function () {
        $(this).addClass("simple-focus")
    });

}

function get_data(t) {

    //每3秒鐘發送AJAX，有回傳才再次重新發送
    setTimeout(function () {
        $.ajax({
            url: "get_comment",
            type: "GET",
            success: function (response) {
                console.log(response);

                for (let i = 0; i < response.length; i++) {

                    t.row.add([
                        response[i]
                    ]).draw(false);
                }
                get_data(t);
            },
            error: function () {
                get_data(t);
            }
        });
    }, 3000)
};






