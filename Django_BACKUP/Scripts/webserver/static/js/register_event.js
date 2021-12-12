
//做好網站初始化設定
const init = () => {

    //將下拉式選單都填入時間區段
    fill_in_select();

    //當select值有所改變，回傳相應直播場次的資料
    select_change();

    //填入Overall直播各場次表現
    fill_all_stream_performance("table_id");

    

    //模仿留言資料傳進來動作
    //button_test("table_comment");

    //使用時間區間的事件
    time_trigger();


    //將overall那張圖 dropdown 事件初始化
    //overall_performance_dropdown();;

    //預設圖表
    trigger_default_chart();

}

const fill_in_select = () => {

    //有哪些表格要初始化datepicker功能，存入array
    const time_inputs = ["#begin_overall",
        "#end_overall",
        "#begin0", "#end0",
        "#begin1", "#end1",
        "#begin2", "#end2",
        "#begin3", "#end3",
        "#begin4", "#end4",
        "#begin5", "#end5"];

    //將input都設定填入時間區段
    fill_in_datepicker(time_inputs);

    //將下拉式選單都填入時間區段
    $.ajax({
        type: "GET",
        url: "get_index/",
        // on success
        success: function (response) {
    
            for (let i = 0; i < response.length; i++) {
                $(".form-select").append(
                    '<option value=' + response[i].id + '>'
                    + response[i].name
                    + '</option>'
                );
            }
        },
        // on error
        error: function (response) {
            // alert the error if any error occured
            console.log(response.responseJSON.errors);
        }
    });
}

//即時更新資料
const instant_data = () => {

    setTimeout(function () {

        $.ajax({
            type: "GET",
            url: "get_instant_data/",
            // on success
            success: function (response) {
                
            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors);
            }
        });

    }, 3000);

}

const fill_in_datepicker = (time_inputs) => {
    time_inputs.forEach(datepicker_init);
}

const datepicker_init = (item, index) => {

    //初始化每個表格的datepicker功能
    $(item).datepicker({ dateFormat: 'yy-mm-dd' });
}

const trigger_default_chart = () =>{
    $('.form-select').each(function(){
        $(this).change();
    });
    

    $('.chart-btn').each(function(){
        $(this).trigger('click');
    });

    goods_turnover_bar_data();
    return_delivery_pie_data();
}

//當select值有所改變，回傳相應直播場次的資料
const select_change = () => {

    //初始化每個選單事件
    product_select_change();
    order_select_change();
    delivery_select_change();
    payment_select_change();
    preorder_select_change();
    gender_select_change();
    age_select_change();
}


const product_select_change = () => {

    //呼叫商品名稱與販賣數量
    $("#product_select").change(function () {
        
        var data = $(this).val();
        if(!data){
            data = 1;
        }
        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': CSRF_TOKEN },
            url: "get_index_product/",
            data: { "time": data },
            // on success
            success: function (response) {
                //回傳結果 array
                response.forEach(function (value) {
                    
                });
            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors)
            }
        });

    });
}

const order_select_change = () => {

    //呼叫每個時段的單據總數
    $("#order_select").change(function () {


        var data = $(this).val();
        if(!data){
            data = 1;
        }
        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'
        $.ajax(
            {
                type: "POST",
                headers: { 'X-CSRFToken': CSRF_TOKEN },
                url: "get_index_order/",
                data: { "streaming": data },
                // on success
                success: function (response) {
                    bid_step_chart_data(response);
                },
                // on error
                error: function (response) {
                    // alert the error if any error occured
                    console.log("Get error:" + response.responseJson)
                },
            });

    });
}

const delivery_select_change = () => {

    //呼叫本場直播配送與付款方式計算
    $("#delivery_select").change(function () {
        var data = $(this).val();
        
        if(!data){
            data = 1;
        }
        console.log(data)
        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': CSRF_TOKEN },
            url: "get_index_delivery/",
            data: { "time": data },
            // on success
            success: function (response) {
                //回傳結果 array
                delivery_term_pie_data(response);
            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors)
            }
        });

    });
}

const payment_select_change = () => {

    //呼叫本場直播配送與付款方式計算
    $("#payment_select").change(function () {
        var data = $(this).val();
        console.log(data);
        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'
        if(!data){
            data = 1;
        }
        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': CSRF_TOKEN },
            url: "get_index_payment/",
            data: { "time": data },
            // on success
            success: function (response) {
                payment_term_pie_data(response);
            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors)
            }
        });

    });
}

const preorder_select_change = () => {

    //呼叫本場直播棄單比例
    $("#preorder_select").change(function () {
        var data = $(this).val();
        if(!data){
            data = 1;
        }
        console.log(data);
        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': CSRF_TOKEN },
            url: "get_index_droporder/",
            data: { "time": data },
            // on success
            success: function (response) {
                //回傳結果 array
                drop_pie_data(response);
            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors)
            }
        });

    });
}

const gender_select_change = () => {

    //呼叫本場直播性別比例
    $("#single_gender_select").change(function () {
    
        var data = $(this).val();
        if(!data){
            data = 1;
        }

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': CSRF_TOKEN },
            url: "get_index_gender/",
            data: { "time": data },
            // on success
            success: function (response) {
                //回傳結果 array
                single_gender_data(response);
            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors)
            }
        });

    });
}

const age_select_change = () => {

    //呼叫本場直播性別比例
    $("#single_age_select").change(function () {
    
        var data = $(this).val();
        if(!data){
            data = 1;
        }

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': CSRF_TOKEN },
            url: "get_index_age/",
            data: { "time": data },
            // on success
            success: function (response) {
                //回傳結果 array
                single_age_data(response);
            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors)
            }
        });

    });
}

//填入Overall直播各場次表現
const fill_all_stream_performance = (id) => {

    //設定datatable
    let t = set_datatable(id);

    $.ajax({
        type: "GET",
        url: "get_stream_data/",
        // on success
        success: function (response) {

            for (let i = 0; i < response.length; i++) {
                t.row.add([
                    response[i].streaming_name,
                    response[i].streaming_time,
                    response[i].streaming_like,
                    response[i].streaming_comment,
                    response[i].streaming_share,
                    response[i].streaming_views,
                    response[i].streaming_orders
                ]).draw(false);
            }
        },
        // on error
        error: function (response) {
            // alert the error if any error occured
            console.log(response.responseJSON.errors)
        }

    });
}

//datatable設定
const set_datatable = (id) => {
    let t = $('#' + id).DataTable({
        responsive: true,
        "lengthMenu": [10, 25, 50, 100],
        "language": {
            "processing": "處理中...",
            "loadingRecords": "載入中...",
            "lengthMenu": "顯示 _MENU_ 項結果",
            "zeroRecords": "沒有符合的結果",
            "info": "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
            "infoEmpty": "顯示第 0 至 0 項結果，共 0 項",
            "infoFiltered": "(從 _MAX_ 項結果中過濾)",
            "infoPostFix": "",
            "search": "搜尋:",
            "paginate": {
                "first": "第一頁",
                "previous": "上一頁",
                "next": "下一頁",
                "last": "最後一頁"
            },
            // "aria": {
            //     "sortAscending": ": 升冪排列",
            //     "sortDescending": ": 降冪排列"
            // }
        },
        "ordering": false,
    });

    return t;
}

//測試留言進來的動作
const button_test = (id) => {

    //初始化datatable
    let t = set_datatable(id);


    $("#button-test").click(function () {

        //測試留言資料
        var test = "今天有賣東西嗎?";

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        $.ajax({
            type: "GET",
            headers: { 'X-CSRFToken': CSRF_TOKEN },
            data: { },
            url: "get_comment/",
            // on success
            success: function (response) {

                response.forEach(function (value) {
                    alert("Hi" + value.comment);

                    t.row.add([
                        value.comment
                    ]).draw(false);
                });

            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors)
            }
        });
    });
}

//使用時間區間的事件(不包含overall下方那張圖)
const time_trigger = () => {

    //初始化每張圖的時間選取事件
    chronic_order_time();
    chronic_delivery_time();
    chronic_droporder_status_time();
    chronic_payment_time();
    chronic_performance();
    chronic_age_time();
    chronic_gender_time();
}
const chronic_order_time = () => {

    //初始化點擊事件
    $("#time0").click(function () {

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        //起始時間與結束時間
        var begin_time = $("#begin0").val();
        var end_time = $("#end0").val();
        
        if(!begin_time && !end_time){
            begin_time = '2021-06-17';
            end_time = '2021-11-29';
        }
        

        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': CSRF_TOKEN },
            url: "get_index_chronic_order/",
            data: { "begin_time": begin_time, "end_time": end_time },
            // on success
            success: function (response) {
                orders_bar_data(response);
            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                console.log(response.responseJSON.errors)
            }
        });

    });
}

const chronic_delivery_time = () => {

    //初始化點擊事件
    $("#time1").click(function () {

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        //確認填寫結束與開始的時間
        var begin_time = $("#begin1").val();
        var end_time = $("#end1").val();
        
        if(!begin_time && !end_time){
            begin_time = '2021-06-17';
            end_time = '2021-11-29';
        }

        if (begin_time.length > 0 && end_time.length > 0) {
            $.ajax({
                type: "POST",
                headers: { 'X-CSRFToken': CSRF_TOKEN },
                url: "get_index_chronic_delivery/",
                data: { "begin_time": begin_time, "end_time": end_time },
                // on success
                success: function (response) {
                    delivery_term_bar_chart_data(response);
                },
                // on error
                error: function (response) {
                    // alert the error if any error occured
                    console.log(response.responseJSON.errors)
                }

            });
        }
        else {
            alert("你的日期沒有填寫完全");
        }

    });
}

const chronic_droporder_status_time = () => {

    //初始化點擊事件
    $("#time2").click(function () {

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        //確認填寫結束與開始的時間
        var begin_time = $("#begin2").val();
        var end_time = $("#end2").val();
        if(!begin_time && !end_time){
            begin_time = '2021-06-17';
            end_time = '2021-11-29';
        }
        if (begin_time.length > 0 && end_time.length > 0) {
            $.ajax({
                type: "POST",
                headers: { 'X-CSRFToken': CSRF_TOKEN },
                url: "get_index_chronic_droporder_status/",
                data: { "begin_time": begin_time, "end_time": end_time },
                // on success
                success: function (response) {
                    drop_bar_data(response);
                },
                // on error
                error: function (response) {
                    // alert the error if any error occured
                    console.log(response.responseJSON.errors)
                }
            });
        }
        else {
            alert("你的日期沒有填寫完全");
        }
    });
}

const chronic_gender_time = () => {

    //初始化點擊事件
    $("#time4").click(function () {

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        //確認填寫結束與開始的時間
        var begin_time = $("#begin4").val();
        var end_time = $("#end4").val();
        if(!begin_time && !end_time){
            begin_time = '2021-06-17';
            end_time = '2021-11-29';
        }
        if (begin_time.length > 0 && end_time.length > 0) {
            $.ajax({
                type: "POST",
                headers: { 'X-CSRFToken': CSRF_TOKEN },
                url: "get_index_chronic_gender/",
                data: { "begin_time": begin_time, "end_time": end_time },
                // on success
                success: function (response) {
                    mutiple_gender_data(response);
                },
                // on error
                error: function (response) {
                    // alert the error if any error occured
                    console.log(response.responseJSON.errors)
                }
            });
        }
        else {
            alert("你的日期沒有填寫完全");
        }
    });
}

const chronic_age_time = () => {

    //初始化點擊事件
    $("#time5").click(function () {

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        //確認填寫結束與開始的時間
        var begin_time = $("#begin4").val();
        var end_time = $("#end4").val();
        if(!begin_time && !end_time){
            begin_time = '2021-06-17';
            end_time = '2021-11-29';
        }
        if (begin_time.length > 0 && end_time.length > 0) {
            $.ajax({
                type: "POST",
                headers: { 'X-CSRFToken': CSRF_TOKEN },
                url: "get_index_chronic_age/",
                data: { "begin_time": begin_time, "end_time": end_time },
                // on success
                success: function (response) {
                    mutiple_age_data(response);
                },
                // on error
                error: function (response) {
                    // alert the error if any error occured
                    console.log(response.responseJSON.errors)
                }
            });
        }
        else {
            alert("你的日期沒有填寫完全");
        }
    });
}

const chronic_payment_time = () => {

    //初始化點擊事件
    $("#time3").click(function () {

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        //確認填寫結束與開始的時間
        var begin_time = $("#begin3").val();
        var end_time = $("#end3").val();
        if(!begin_time && !end_time){
            begin_time = '2021-06-17';
            end_time = '2021-11-29';
        }
        if (begin_time.length > 0 && end_time.length > 0) {
            $.ajax({
                type: "POST",
                headers: { 'X-CSRFToken': CSRF_TOKEN },
                url: "get_index_chronic_payment/",
                data: { "begin_time": begin_time, "end_time": end_time },
                // on success
                success: function (response) {
                    payment_term_bar_chart_data(response);
                },
                // on error
                error: function (response) {
                    // alert the error if any error occured
                    console.log(response.responseJSON.errors)
                }
            });
        }
        else {
            alert("你的日期沒有填寫完全");
        }
    });
}

const chronic_performance = () => {

    //初始化點擊事件
    $("#time_overall").click(function () {

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        //確認填寫結束與開始的時間
        var begin_time = $("#begin_overall").val();
        var end_time = $("#end_overall").val();
        if(!begin_time && !end_time){
            begin_time = '2021-06-17';
            end_time = '2021-11-29';
        }
        if (begin_time.length > 0 && end_time.length > 0) {
            $.ajax({
                type: "POST",
                headers: { 'X-CSRFToken': CSRF_TOKEN },
                url: "get_index_chronic_performance/",
                data: { "begin_time": begin_time, "end_time": end_time },
                // on success
                success: function (response) {
                    stack_bar_chart(response);
                },
                // on error
                error: function (response) {
                    // alert the error if any error occured
                    console.log(response.responseJSON.errors)
                }
            });
        }
        else {
            alert("你的日期沒有填寫完全");
        }
    });
}

//overall下方圖的時間、dropdown 與 Button 初始化
/**
const overall_performance_dropdown=()=>{

    //dropdown 設定
    var banks = $('.checkbox-menu').children();

    $('.all>input').click(function() {
        var flag = $(this).prop('checked');
        $(this).prop('checked');
        //如果選擇全部的話，會連所有指標一起勾選
        banks.each(function(){
            $(this).children().children().prop('checked',flag);
        });

    });

    banks.click(function(){
        // 如果有一個沒選中，全選按鈕不選中
        // 如果全部選中，全選按鈕被選中
        var num = 0;
        banks.each(function() {
            if ($(this).children().children()[0].value=="all") {
                //不做任何事
            }
            else if($(this).children().children().prop("checked")){
                num++;
            }

        });

        if (num == banks.length-1) {
            $('.all>input').prop('checked', true);
        }
        else {
            $('.all>input').prop('checked', false);
        }
    });

    $("#time_overall").click(function(){

        //csrf_token確認cookie
        //let csrftoken = '{{ csrf_token }}'

        //確認填寫結束與開始的時間
        var begin_time=$("#begin_overall").val();
        var end_time=$("#end_overall").val();

        //確認勾選項目
        bank_index=[]
        banks.each(function() {

            if($(this).children().children().prop("checked")==false){
                if($(this).children().children()[0].value=="all"){
                    //小心不要選到全部
                }
                else{
                    bank_index.push($(this).children().children()[0].value);
                }
            }

        });

        console.log(bank_index);

        if(begin_time.length>0 && end_time.length>0){
            $.ajax({
                type: "POST",
                headers:{'X-CSRFToken':CSRF_TOKEN},
                url: "get_index_chronic_performance/",
                data:{"begin_time":begin_time, "end_time":end_time, "bank_index":bank_index },
                // on success
                success: function(response) {

                },
                // on error
                error: function(response) {
                    // alert the error if any error occured
                    console.log(response.responseJSON.errors)
                }
            });
        }
        else{
            alert("你的日期沒有填寫完全");
        }
    });
}
**/
