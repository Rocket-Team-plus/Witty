$(document).ready(function () {

    let t=set_datatable("table_comment");

    //網站初始化設定
    init();

    //取得資料
    get_data(t);

    
});

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml1 .letters');


anime.timeline({loop: true})
  .add({
    targets: '.ml1 .letter',
    scale: [0.3,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 600,
    delay: (el, i) => 70 * (i+1)
  }).add({
    targets: '.ml1 .line',
    scaleX: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700,
    offset: '-=875',
    delay: (el, i, l) => 80 * (l - i)
  }).add({
    targets: '.ml1',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });


function get_data(t){

    //每3秒鐘發送AJAX，有回傳才再次重新發送
    setTimeout(function(){
        $.ajax({
            url:"get_comment",
            type:"GET",
            success:function(response){
                console.log(response);

                    for(let i=0;i<response.length;i++){

                        t.row.add([
                            response[i]
                        ]).draw(false);
                    }
                get_data(t);
            },
            error:function(){
                get_data(t);
            }
        }); 
    },3000)
};






