//初始化全域變數
const intent = [" ", "商品", "直播", "配送", "付款", "標數"];

const entity = [" ", "商品種類", "商品價格", "付款方式", "配送方式"];

$("#clickAll").click(function () {
    if ($("#clickAll").prop("checked")) {
        $(".form-check-input").each(function () {
            $(this).prop("checked", true);
            $(this).closest('.training_area').css({
                "background-color": "#C2DBFF",
            });
            if ($(this).hasClass("checked")) {
    
            }
            else {
                //所有的checkbox click事件
                $(this).addClass("checked");
    
                console.log("Check Click");
            }
        });
    } else {
        $(".form-check-input").each(function () {
            $(this).prop("checked", false);
            $(this).closest('.training_area').css({
                "background-color": "transparent",
            });
            if ($(this).hasClass("checked")) {

                $(this).removeClass("checked");
    
            }
        });
    }
});

$(".form-check-input").each(function () {
    $(this).click(function () {
        if ($(this).prop("checked")) {
            $(this).closest('.training_area').css({
                "background-color": "#C2DBFF",
                "font": "#fff",
            });
        } else {
            $(this).closest('.training_area').css({
                "background-color": "transparent",
                "font": "black",
            });
        }
    });


});

$(".form-select").each(function () {
    $(this).addClass("simple-focus");
});

(function (document) {
    'use strict';

    // 建立 LightTableFilter
    var LightTableFilter = (function (Arr) {

        var _input;

        // 資料輸入事件處理函數
        function _onInputEvent(e) {
            _input = e.target;
            var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
            Arr.forEach.call(tables, function (table) {
                Arr.forEach.call(table.tBodies, function (tbody) {
                    Arr.forEach.call(tbody.rows, _filter);
                });
            });
        }

        // 資料篩選函數，顯示包含關鍵字的列，其餘隱藏
        function _filter(row) {
            var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
            row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
        }

        return {
            // 初始化函數
            init: function () {
                var inputs = document.getElementsByClassName('light-table-filter');
                Arr.forEach.call(inputs, function (input) {
                    input.oninput = _onInputEvent;
                });
            }
        };
    })(Array.prototype);

    // 網頁載入完成後，啟動 LightTableFilter
    document.addEventListener('readystatechange', function () {
        if (document.readyState === 'complete') {
            LightTableFilter.init();
        }
    });

})(document);

const training_transform = () => {


}

const del_data = () => {
    //剩下明天做，就是他要消失

    //訓練按鈕click事件
    $("#train").click(function () {

        let comment_array = [];
        //先取得學習的值
        $(".checked").each(function () {
            //將每場直播的text也塞進input的text Attribute裡
            comment_array.push($(this).attr("text"));
        });

        console.log("Getting comment array: " + comment_array);

        let intent_val = $("#intent0").val();
        let entity_val = $("#entity0").val();
        //防呆機制
        if (intent_val == "選擇 intent") {

            alert("您的選擇並未完全");

        }
        else {
            comment_array.forEach(function (value) {
                //conversion
                intent_val = parseInt(intent_val,10);
                entity_val = parseInt(entity_val,10);
                //alert("Your " + value + " is trained in " + intent[intent_val] + " intent and " + entity[entity_val] + " entity.");
                training(value, intent[intent_val], entity[entity_val]);
                console.log($(".checked").parent().parent());
                $(".checked").parent().parent().parent().parent().fadeOut("slow");
            })
        }
    });

    $(".form-check-input").click(function () {

        if ($(this).hasClass("checked")) {

            $(this).removeClass("checked");

        }
        else {
            //所有的checkbox click事件
            $(this).addClass("checked");

            console.log("Check Click");
        }
    })
}

const counting_data = (amount) => {
    for (let i = 0; i < amount; i++) {
        training_check(i);
    }
}

const training_check = (id) => {

    $("#check" + id).click(function () {

        if ($(this).hasClass("checked")) {

            $(this).removeClass("checked");

        }
        else {
            //所有的checkbox click事件
            $(this).addClass("checked");

            console.log("Check Click");
        }

    });

}

const training = (comment, intent, entity) => {

    //ajax更新資料庫的訓練狀態
    $.ajax({
        type: "POST",
        headers: { 'X-CSRFToken': CSRF_TOKEN },
        url: "training_action/",
        data: { "comment": comment, "intent": intent, "entity": entity },
        // on success
        success: function (response) {
            console.log(response);
            if (response == "200 OK") {
                //alert("成功搂!!!!!!!");
            }

        },
        // on error
        error: function (response) {
            // alert the error if any error occured
            console.log(response.responseJSON.errors)
        }
    });
}

del_data();