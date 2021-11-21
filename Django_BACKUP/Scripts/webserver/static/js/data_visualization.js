//初始化基本變數
const COLORS = [
    '#4dc9f6',
    '#f67019',
    '#378888',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'

];

var streaming_stack_bar_chart = null;
var bid_step_chart_chart = null;
var orders_bar_myChart = null;
var delivery_term_pie_chart = null;
var delivery_term_bar_chart = null;
var payment_term_pie_chart = null;
var payment_term_bar_chart = null;
var drop_bar_chart = null;
var drop_pie_chart = null;
var single_gender_chart = null;
var mutiple_gender_chart = null;
var single_age_chart = null;
var mutiple_age_chart = null;

const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

const NAMED_COLORS = [
    CHART_COLORS.red,
    CHART_COLORS.orange,
    CHART_COLORS.yellow,
    CHART_COLORS.green,
    CHART_COLORS.blue,
    CHART_COLORS.purple,
    CHART_COLORS.grey,
];

//Overall那頁的第一張圖

const stack_bar_chart = (streaming_datas) => {

    //拆解傳進來的變數
    let data_length = streaming_datas.length;
    let streaming_names = streaming_datas[0];
    let streaming_times = streaming_datas[1];
    let streaming_likes = streaming_datas[2];
    let streaming_comments = streaming_datas[3];
    let streaming_shares = streaming_datas[4];
    let streaming_order_amounts = streaming_datas[5];
    let streaming_views = streaming_datas[6];

    // <block:setup:1>
    const DATA_COUNT = data_length;
    const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

    const labels = streaming_names;

    const stack_bar_chart_config = {
        type: 'bar',
        data: {
            labels: streaming_times, // responsible for how many bars are gonna show on the chart
            //邊界寬度
            borderWidth: 1,
            datasets: [{
                label: '按讚數',
                data: streaming_likes,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
            }, {
                label: '留言數',
                data: streaming_comments,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }, {
                label: '分享數',
                data: streaming_shares,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            }, {
                label: '訂單總數',
                data: streaming_order_amounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }, {
                label: '觀看數',
                data: streaming_views,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '各日期直播場次互動數圖',
                    font:{
                        size:18
                    }
                },
                legend: {
                    position: 'top',
                    label:{
                        font:{
                            size:18
                        }
                    }
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'right' // place legend on the right side of chart
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '日期',
                        color: '#073888',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 20, left: 0, right: 0, bottom: 0 }
                    },
                    stacked: true,
                },

                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '數量',
                        color: '#4285F4',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 30, left: 0, right: 0, bottom: 0 }
                    },
                    stacked: true,
                }
            },
        }
    };

    if (streaming_stack_bar_chart) {
        streaming_stack_bar_chart.destroy();
    }

    var streaming_stack_bar_ctx = document.getElementById("streaming_stack_bar_chart").getContext("2d");
    canvas_resize("streaming_stack_bar_chart")
    streaming_stack_bar_chart = new Chart(streaming_stack_bar_ctx, stack_bar_chart_config);
}

//數場直播下的每標狀況
const bid_step_chart_data = (streaming_datas) => {
    //初始化變數
    let data_length = streaming_datas.length;
    let streaming_names = streaming_datas[0]
    let streaming_dates = streaming_datas[1]
    let streaming_bids = streaming_datas[2]
    let order_amounts = streaming_datas[3]

    // </block:actions>
    const bid_step_chart_data = {
        labels: ['2021/06/07', '2021/08/11', '2021/08/12', '2021/08/27', '2021/09/07'],
        datasets: [
            {
                label: '第一標',
                data: [25, 50, 62, 45, 39, 33],
                borderColor: 'rgba(255,99,132,1)',
                fill: false,
                stepped: true,
            },
            {
                label: '第二標',
                data: [15, 35, 47, 52, 67, 58],
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
                stepped: true,
            },
            {
                label: '第三標',
                data: [21, 56, 89, 64, 53, 12],
                borderColor: 'rgba(255, 206, 86, 1)',
                fill: false,
                stepped: true,
            },
            {
                label: '第四標',
                data: [8, 18, 34, 44, 48, 52],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                stepped: true,
            },
            {
                label: '第五標',
                data: [21, 35, 41, 49, 58, 56],
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
                stepped: true,
            },
            {
                label: '第六標',
                data: [23, 56, 84, 110, 96, 65],
                borderColor: 'rgba(255, 159, 64,1)',
                fill: false,
                stepped: true,
            },
            {
                label: '第七標',
                data: [32, 45, 52, 35, 67, 98],
                borderColor: 'rgb(201, 203, 207)',
                fill: false,
                stepped: true,
            }
        ]
    };
    // </block:setup>

    bid_step_chart_config(bid_step_chart_data);
}

const bid_step_chart_config = (bid_step_chart_data) => {

    // <block:config:0>
    const bid_step_chart_config = {
        type: 'line',
        data: bid_step_chart_data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                axis: 'x'
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '場次',
                        color: '#073888',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 20, left: 0, right: 0, bottom: 0 }
                    }
                },

                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '單據完成數量',
                        color: '#4285F4',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 20, left: 0, right: 0, bottom: 0 }
                    },
                    //min: 0,
                    //max: 1,
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: (ctx) => '各標下單數量圖',
                    font: {
                        size: 18,
                    }
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                }
            }
        }
    };
    // </block:config>
    if (bid_step_chart_chart != null) {
        bid_step_chart_chart.destroy();
    }
    var bid_step_chart_ctx = document.getElementById('bid_step_chart_chart').getContext('2d');
    canvas_resize('bid_step_chart_chart');
    bid_step_chart_chart = new Chart(bid_step_chart_ctx, bid_step_chart_config);


}

const orders_bar_data = (streaming_datas) => {

    //拆解傳進來的變數
    let data_length = streaming_datas.length;
    let streaming_names = streaming_datas[0];
    let order_amounts = streaming_datas[1];

    const orders_bar_data = {
        labels: ['2021/08/11', '2021/08/12', '2021/08/28', '2021/09/07', '2021/09/10'],
        datasets: [{
            type: 'bar',
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(201, 203, 207,0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(201, 203, 207,1)'
            ],
            borderWidth: 1,
            label: '總下單量',
            data: [1280, 770, 900, 805, 900]
        }, {
            type: 'line',
            label: '銷售業績(萬)',
            data: [900, 800, 1920, 790, 985]
        }]
    };

    orders_bar_config(orders_bar_data);
}

const orders_bar_config = (orders_bar_datas) => {

    const orders_bar_config = {
        display: true,
        type: 'bar',
        data: orders_bar_datas,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '各場次單據完成數量圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '場次',
                        color: '#073888',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 20, left: 0, right: 0, bottom: 0 }
                    }
                },

                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '單據完成數量',
                        color: '#4285F4',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 30, left: 0, right: 0, bottom: 0 }
                    },
                    //min: 0,
                    //max: 1,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    };

    if (orders_bar_myChart) {
        orders_bar_myChart.destroy();
    }

    var orders_bar_ctx = document.getElementById('orders_bar_chart').getContext('2d');
    canvas_resize('orders_bar_chart');
    orders_bar_myChart = new Chart(orders_bar_ctx, orders_bar_config);
}


//應該是第二張圖
const orders_line_chart_data = (streaming_datas) => {

    const orders_line_chart_data = {
        labels: [0, 1, 2, 3, 4, 5],
        datasets: [
            {
                label: '各場次直播訂單完成數',
                data: [250, 284, 156, 268, 352, 132],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                backgroundColor: CHART_COLORS.red
            },
        ]
    };

}

const orders_line_chart_config = (streaming_datas) => {


    const orders_line_chart_config = {
        type: 'line',
        data: orders_line_chart_data,
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
                title: {
                    display: true,
                    text: '各場次直播訂單完成數折線圖',
                    font: {
                        size: 18
                    }
                }

            }
        },
    };



}

const delivery_term_pie_data = (streaming_datas) => {

    //拆解傳進來的變數
    let data_length = streaming_datas.length;
    let delivery_terms = streaming_datas[0];
    let delivery_amounts = streaming_datas[1];

    //payment pie chart
    const delivery_term_pie_data = {
        labels: delivery_terms,
        //labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [
            {
                label: '配送分布比例',
                data: delivery_amounts,
                backgroundColor: CHART_COLORS.red,
            },
        ]
    };
    // </block:setup>

    delivery_term_pie_config(delivery_term_pie_data);

}

const delivery_term_pie_config = (delivery_term_pie_data) => {

    // <block:config:0>
    const delivery_term_pie_config = {
        display: true,
        type: 'pie',
        data: delivery_term_pie_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '單場次付款方式比例圓餅圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },

            responsive: true,
            maintainAspectRatio: false,

        }
    };

    if (delivery_term_pie_chart) {
        delivery_term_pie_chart.destroy();
    }

    var delivery_term_pie_ctx = document.getElementById('delivery_term_pie_chart').getContext('2d');
    canvas_resize('delivery_term_pie_chart');
    delivery_term_pie_chart = new Chart(delivery_term_pie_ctx, delivery_term_pie_config);


}

const delivery_term_bar_chart_data = (streaming_datas) => {



    //payment term bar chart
    const delivery_term_bar_data = {
        datasets: []
    };

    //資料新增的For迴圈
    for (let i = 0; i < streaming_datas.length; i++) {

        delivery_term_bar_data.datasets.push(streaming_datas[i]);

    }
    delivery_term_bar_config(delivery_term_bar_data);

}

const delivery_term_bar_config = (delivery_term_bar_data) => {

    // <block:config:0>
    const payment_term_bar_config = {
        display: true,
        type: 'bar',
        data: delivery_term_bar_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '各場次付款方式比例圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '場次',
                        color: '#073888',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 20, left: 0, right: 0, bottom: 0 }
                    }
                },

                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '比例',
                        color: '#4285F4',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 30, left: 0, right: 0, bottom: 0 }
                    },
                    min: 0,
                    max: 1,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    };

    if (delivery_term_bar_chart) {
        delivery_term_bar_chart.destroy();
    }

    var delivery_term_bar_ctx = document.getElementById('delivery_term_bar_chart').getContext('2d');
    canvas_resize('delivery_term_bar_chart');
    delivery_term_bar_chart = new Chart(delivery_term_bar_ctx, payment_term_bar_config);

}


const payment_term_pie_data = (streaming_datas) => {

    //拆解傳進來的變數
    let data_length = streaming_datas.length;
    let payment_terms = streaming_datas[0];
    let payment_amounts = streaming_datas[1];

    //payment pie chart
    const payment_term_pie_data = {
        labels: payment_terms,
        //labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [
            {
                label: '付款比例',
                data: payment_amounts,
                backgroundColor: CHART_COLORS.red,
            },
        ]
    };
    // </block:setup>

    payment_term_pie_config(payment_term_pie_data);

}

const payment_term_pie_config = (payment_term_pie_data) => {

    // <block:config:0>
    const payment_term_pie_config = {
        display: true,
        type: 'pie',
        data: payment_term_pie_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '單場次付款方式比例圓餅圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },

            responsive: true,
            maintainAspectRatio: false,

        }
    };

    if (payment_term_pie_chart) {
        payment_term_pie_chart.destroy();
    }
    var payment_term_pie_ctx = document.getElementById('payment_term_pie_chart').getContext('2d');

    payment_term_pie_chart = new Chart(payment_term_pie_ctx, payment_term_pie_config);
    canvas_resize('payment_term_pie_chart');

}

const payment_term_bar_chart_data = (streaming_datas) => {


    //payment term bar chart
    const payment_term_bar_data = {
        datasets: []
    };

    //資料新增的For迴圈
    for (let i = 0; i < streaming_datas.length; i++) {

        payment_term_bar_data.datasets.push(streaming_datas[i]);

    }


    payment_term_bar_config(payment_term_bar_data);

}

const payment_term_bar_config = (payment_term_bar_data) => {

    // <block:config:0>
    const payment_term_bar_config = {
        display: true,
        type: 'bar',
        data: payment_term_bar_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '各場次付款方式比例圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '場次',
                        color: '#073888',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 20, left: 0, right: 0, bottom: 0 }
                    }
                },

                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '比例',
                        color: '#4285F4',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 30, left: 0, right: 0, bottom: 0 }
                    },
                    min: 0,
                    max: 1,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    };

    if (payment_term_bar_chart) {
        payment_term_bar_chart.destroy();
    }
    var payment_term_bar_ctx = document.getElementById('payment_term_bar_chart').getContext('2d');
    canvas_resize('payment_term_bar_chart');
    payment_term_bar_chart = new Chart(payment_term_bar_ctx, payment_term_bar_config);

}

const drop_bar_data = (streaming_datas) => {
    //drop proportion bar chart
    const drop_bar_data = {
        datasets: []
    };
    // </block:setup>

    //資料新增的For迴圈
    for (let i = 0; i < streaming_datas.length; i++) {

        drop_bar_data.datasets.push(streaming_datas[i]);

    }

    drop_bar_config(drop_bar_data);

}

const drop_bar_config = (drop_bar_data) => {


    // <block:config:0>
    const drop_bar_config = {
        display: true,
        type: 'bar',
        data: drop_bar_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '各場次棄單比例圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '場次',
                        color: '#073888',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 20, left: 0, right: 0, bottom: 0 }
                    }
                },

                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '比例',
                        color: '#4285F4',
                        font: {
                            family: 'Comic Sans MS',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 30, left: 0, right: 0, bottom: 0 }
                    },
                    min: 0,
                    max: 1,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    };

    if (drop_bar_chart) {
        drop_bar_chart.destroy();
    }

    var drop_bar_ctx = document.getElementById('drop_chart').getContext('2d');
    canvas_resize('drop_chart');
    drop_bar_chart = new Chart(drop_bar_ctx, drop_bar_config);

}

const drop_pie_data = (streaming_datas) => {

    //拆解傳進來的變數
    let data_length = streaming_datas.length;
    let status_terms = streaming_datas[0];
    let status_amounts = streaming_datas[1];

    //drop proportion pie chart
    const drop_pie_data = {
        labels: status_terms,
        //labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [
            {
                label: '棄單比例',
                data: status_amounts,
                backgroundColor: Object.values(CHART_COLORS),
            },
        ]
    };
    // </block:setup>

    drop_pie_config(drop_pie_data);
}

const drop_pie_config = (drop_pie_data) => {


    // <block:config:0>
    const drop_pie_config = {
        display: true,
        type: 'pie',
        data: drop_pie_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '單場次訂單狀況比例圓餅圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'right',

                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },

            responsive: true,
            maintainAspectRatio: false,

        }
    };

    if (drop_pie_chart) {
        drop_pie_chart.destroy();
    }
    var drop_pie_ctx = document.getElementById('drop_pie_chart').getContext('2d');
    canvas_resize('drop_pie_chart');
    drop_pie_chart = new Chart(drop_pie_ctx, drop_pie_config);

}

const single_gender_data = (streaming_datas) => {

    //拆解傳進來的變數
    let data_length = streaming_datas.length;
    let males = streaming_datas[0].males;
    let females = streaming_datas[0].females;

    let males_ratio = males / (males + females);
    let females_ratio = females / (males + females);

    //drop proportion pie chart
    const single_gender_data = {
        labels: ['男性', '女性'],
        datasets: [
            {
                label: '性別比例',
                data: [males_ratio, females_ratio],
                backgroundColor: Object.values(CHART_COLORS),
                hoverOffset: 4
            },
        ],

    };
    // </block:setup>

    single_gender_config(single_gender_data);
}

const single_gender_config = (single_gender_data) => {


    // <block:config:0>
    const single_gender_config = {
        display: true,
        type: 'bar',
        data: single_gender_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '單場次性別比例長條圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'right',

                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },

            responsive: true,
            maintainAspectRatio: false,

        }
    };

    if (single_gender_chart) {
        single_gender_chart.destroy();
    }
    var single_gender_ctx = document.getElementById('single_gender_chart').getContext('2d');
    canvas_resize('single_gender_chart');
    single_gender_chart = new Chart(single_gender_ctx, single_gender_config);

}

const single_age_data = (streaming_datas) => {

    //拆解傳進來的變數
    let males = streaming_datas[0].males;
    let females = streaming_datas[0].females;
    let total_audience_numbers = males + females;

    let data_length = streaming_datas.length;
    let twenty_to_thirty_ratio = streaming_datas[0].twenty_to_thirty / total_audience_numbers * 100;
    let thirty_to_forty_ratio = streaming_datas[0].thirty_to_forty / total_audience_numbers* 100;
    let forty_to_fifty_ratio = streaming_datas[0].forty_to_fifty / total_audience_numbers* 100;
    let fifty_to_sixty_ratio = streaming_datas[0].fifty_to_sixty / total_audience_numbers* 100;
    let sixty_to_seventy_ratio = streaming_datas[0].sixty_to_seventy / total_audience_numbers* 100;

    //drop proportion pie chart
    const single_age_data = {
        labels: ['20-30', '30-40', '40-50', '50-60', '60-70'],
        datasets: [
            {
                label: '年齡比例(%)',
                data: [twenty_to_thirty_ratio, thirty_to_forty_ratio, forty_to_fifty_ratio,
                    fifty_to_sixty_ratio, sixty_to_seventy_ratio],
                backgroundColor: Object.values(CHART_COLORS),
                hoverOffset: 4
                
            },
            {
                type: 'line',
                label: '消費力(萬)',
                data: [15, 54, 80, 65, 34]
            }
        ],

    };
    // </block:setup>

    single_age_config(single_age_data);
}

const single_age_config = (single_age_data) => {


    // <block:config:0>
    const single_age_config = {
        display: true,
        type: 'bar',
        data: single_age_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '單場次年齡比例圓餅圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'right',

                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },

            responsive: true,
            maintainAspectRatio: false,

        }
    };

    if (single_age_chart) {
        single_age_chart.destroy();
    }
    var single_age_ctx = document.getElementById('single_age_chart').getContext('2d');
    canvas_resize('single_age_chart');
    single_age_chart = new Chart(single_age_ctx, single_age_config);

}

const mutiple_gender_data = (streaming_datas) => {

    //拆解傳進來的變數
    let males =0;
    let females=0;
    let total_audience_numbers=0;
    
    for (let i =0; i< streaming_datas[0].length-1;i++) {
        males += streaming_datas[0][i];
        females += streaming_datas[1][i];
    }
    total_audience_numbers = males + females;
    males_ratio = males/total_audience_numbers;
    females_ratio = females/total_audience_numbers;

    //drop proportion pie chart
    const mutiple_gender_data = {
        labels: ['男性','女性'],
        datasets: [
            {
                label: '性別比例',
                data: [males_ratio,females_ratio],
                backgroundColor: Object.values(CHART_COLORS),
                hoverOffset: 4
            },
        ],

    };
    // </block:setup>

    mutiple_gender_config(mutiple_gender_data);
}

const mutiple_gender_config = (mutiple_gender_data) => {


    // <block:config:0>
    const mutiple_gender_config = {
        display: true,
        type: 'bar',
        data: mutiple_gender_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '多場次平均性別比例長條圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'right',

                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },

            responsive: true,
            maintainAspectRatio: false,

        }
    };

    if (mutiple_gender_chart) {
        mutiple_gender_chart.destroy();
    }
    var mutiple_gender_ctx = document.getElementById('mutiple_gender_chart').getContext('2d');
    canvas_resize('mutiple_gender_chart');
    mutiple_gender_chart = new Chart(mutiple_gender_ctx, mutiple_gender_config);

}

const mutiple_age_data = (streaming_datas) => {

    //拆解傳進來的變數
    let males =0;
    let females=0;
    let total_audience_numbers=0;
    let twenty_to_thirty=0;
    let thirty_to_forty=0;
    let forty_to_fifty=0;
    let fifty_to_sixty=0;
    let sixty_to_seventy=0;

    console.log(streaming_datas[5][1]);
    for (let i =0; i< streaming_datas[0].length-1;i++) {
        males =males+ streaming_datas[5][i];
        females += streaming_datas[6][i];
        twenty_to_thirty += streaming_datas[0][i];
        thirty_to_forty += streaming_datas[1][i];
        forty_to_fifty += streaming_datas[2][i];
        fifty_to_sixty += streaming_datas[3][i];
        sixty_to_seventy += streaming_datas[4][i];
    }
    total_audience_numbers = males + females
    twenty_to_thirty_ratio = twenty_to_thirty / total_audience_numbers;
    thirty_to_forty_ratio = thirty_to_forty / total_audience_numbers;
    forty_to_fifty_ratio = forty_to_fifty / total_audience_numbers;
    fifty_to_sixty_ratio = fifty_to_sixty / total_audience_numbers;
    sixty_to_seventy_ratio = sixty_to_seventy / total_audience_numbers;

    //drop proportion pie chart
    const mutiple_age_data = {
        labels: ['20-30', '30-40', '40-50', '50-60', '60-70'],
        datasets: [
            {
                label: '年齡比例',
                data: [twenty_to_thirty_ratio, thirty_to_forty_ratio, forty_to_fifty_ratio,
                    fifty_to_sixty_ratio, sixty_to_seventy_ratio],
                backgroundColor: Object.values(CHART_COLORS),
                hoverOffset: 4
            },
        ],

    };
    // </block:setup>

    mutiple_age_config(mutiple_age_data);
}

const mutiple_age_config = (mutiple_age_data) => {


    // <block:config:0>
    const mutiple_age_config = {
        display: true,
        type: 'bar',
        data: mutiple_age_data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '多場次平均年齡比例圓餅圖',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'right',

                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 18
                        }
                    }
                },
            },

            responsive: true,
            maintainAspectRatio: false,

        }
    };

    if (mutiple_age_chart) {
        mutiple_age_chart.destroy();
    }
    var mutiple_age_ctx = document.getElementById('mutiple_age_chart').getContext('2d');
    canvas_resize('mutiple_age_chart');
    mutiple_age_chart = new Chart(mutiple_age_ctx, mutiple_age_config);

}


//即時資料
const instant_data_config = (new_data) => {

    // create initial empty chart
    var ctx_live = document.getElementById("mycanvas");
    var myChart = new Chart(ctx_live, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                borderWidth: 1,
                borderColor: '#00c0ef',
                label: 'liveCount',
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Chart.js - Dynamically Update Chart Via Ajax Requests",
            },
            legend: {
                display: false,
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 18
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        }
    });

}

// used for example purposes
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// create initial empty chart
var ctx_live = document.getElementById("mycanvas");
var myChart = new Chart(ctx_live, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderWidth: 1,
            borderColor: '#00c0ef',
            label: '留言數',
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: "Chart.js - Dynamically Update Chart Via Ajax Requests",
        },
        legend: {
            display: false
        },
        scales: {

        }
    }
});

// this post id drives the example data
var postId = 1;
var get_comment_data_times = 0;
var random_number = 1;
// logic to get new data
var getData = function () {

    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts/' + postId + '/comments',
        success: function (data) {
            // process your data to pull out what you plan to use to update the chart
            // e.g. new label and a new data point

            // add new label and data point to chart's underlying data structures
            myChart.data.labels.push("Time " + postId++);

            myChart.data.datasets[0].data.push(getRandomIntInclusive(random_number, random_number + 3));
            random_number = myChart.data.datasets[0].data[get_comment_data_times];
            get_comment_data_times = get_comment_data_times + 1;
            // re-render the chart
            myChart.update();
        }
    });
};

// get new data every 3 seconds
setInterval(getData, 10000);

function canvas_resize(chart_id) {
    var current_element = document.getElementById(chart_id);

    parent_width = current_element.parentElement.clientWidth;
    parent_height = current_element.parentElement.clientHeight;

    current_element.width = parent.width;
    current_element.height = parent.height;

}


