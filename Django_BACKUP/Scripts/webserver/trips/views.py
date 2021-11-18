from django.shortcuts import render
# trips/views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import datetime
from django.http import JsonResponse
from trips.models import Products
from trips.models import Streamings
from trips.models import Orders
from trips.models import StreamingsDetail
from trips.models import MessageTemp

from django.db.models import Count
from django.db.models import *
from django.db.models import Q

import json

from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse

from .forms import DateForm

from django.views.decorators.cache import never_cache
#Python需要模組
import random

colors_choice=['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)','rgb(153, 102, 255)']

@csrf_exempt
@never_cache
def hello_world(request):

	print(request)

	return render(request, 'hello_world.html')

def training_data(request):

	#取得資料庫裡的資料
	messages=MessageTemp.objects.filter(Q(intents=None)|Q(entities=None))

	#計算message有多少
	return render(request, 'training.html',{
		'message':messages
	})

def training_action(request):

	print("it's training")

	comment=request.POST.get('comment')
	intent=request.POST.get('intent')
	entity=request.POST.get('entity')

	print(comment)

	MessageTemp.objects.filter(text=comment).update(intents=intent,entities=entity)

	response="200 OK"

	return JsonResponse(response,safe=False)

def fill_form(request):

	return render(request, 'fill_form.html')

def test_polling(request):
    print(request)

    print('good')
    return render(request, 'hello_world.html', {
        'current_time': str(datetime.now()),
    })

def get_data(request):
    products=Products.objects.all()

    response=[]

    for product in products:
        response_json=dict(name=product.product_name)
        response.append(response_json)

    if request.is_ajax():
        print("good")
        print(request.method)
        print(response)

    return JsonResponse(response, safe=False)

def get_index(request):

	streamings = Streamings.objects.all()

	response = []

	print(streamings)

	for streaming in streamings:
		response_json = dict(id=streaming.streaming_id,name=streaming.streaming_name)
		response.append(response_json)

	if request.is_ajax():
		print(response)

	return JsonResponse(response, safe=False)

#回傳單場直播的商品狀態
def get_index_product(request):
    # 前端回傳數值
    index=request.POST.get('time')
    response=[]

    #去抓 Product 的 sold_quantity
    products=Products.objects.filter(streaming=index)
    for product in products:
        response_json=dict(product_name=product.product_name,amount=product.quantity_sold)
        response.append(response_json)

    print(response)

    return JsonResponse(response, safe=False)

#回傳單場直播的單據數量狀況
def get_index_order(request):
    # 前端回傳數值
    index=request.POST.get('streaming')
    response=[]
	

    #time_record 下的每張單據 ????? 相同 time_record 下的單據總數
    orders=Orders.objects.filter(streaming=index).values("time_record").annotate(amount=Count("time_record")).order_by("time_record")
	

    for order in orders:
        response_json=dict(name=order["time_record"],amount=order["amount"])
        response.append(response_json)

    print(response)

    return JsonResponse(response, safe=False)

#回傳長期時段下每場直播的單據數量表現 
def get_index_chronic_order(request):
	# 前端回傳數值
	begin_time=request.POST.get('begin_time')
	end_time=request.POST.get('end_time')

	response=[]


	#初始化直播名稱、標的、訂單數量的array
	streaming_names=[]
	order_amounts=[]

	#每場直播的單據總數
	orders=StreamingsDetail.objects.all().select_related('streaming').filter(time_record__range=(begin_time,end_time)).order_by("streaming")

	for order in orders:
		streaming_names.append(order.streaming.streaming_name)
		order_amounts.append(order.order_amount)
	
	response.append(streaming_names)
	response.append(order_amounts)

	print(response)

	return JsonResponse(response, safe=False)

#回傳一個時間段下，數場直播下的每個標的的販賣情形
def get_index_chronic_order_bid(request):

	# 前端回傳數值
	begin_time=request.POST.get('begin_time')
	end_time=request.POST.get('end_time')

	response=[]


	#初始化直播名稱、標的、訂單數量的array
	streaming_names=[]
	streaming_bids=[]
	order_amounts=[]

	#先取得該時間段的每場直播
	streamings=StreamingsDetail.objects.select_related("streaming").filter(time_record__range=("2021-07-01","2021-10-01")).order_by("streaming")
	for streaming in streamings:
		print(streaming)
		streaming_bids=Products.objects.filter(streaming=streaming)
		print(streaming_bids)

	#每場直播的單據總數
	streaming_bids=StreamingsDetail.objects.select_related("streaming").filter(time_record__range=("2021-07-01","2021-10-01")).order_by("streaming")
	print(streaming_bids.query)
	print(streaming_bids)
	for streaming_bid in streaming_bids:
		print(streaming_bid.products.product_name)
	
	response.append(streaming_names)
	response.append(streaming_bids)
	response.append(order_amounts)

	print(response)

	return JsonResponse(response, safe=False)	

#回傳單場直播的顧客配送比例表現
def get_index_delivery(request):

	# 前端回傳數值
	index=request.POST.get('time')
	response=[]

	#初始化參數
	delivery_term=[]
	delivery_amounts=[]

	orders_num = Orders.objects.filter(streaming=index).count()
	orders=Orders.objects.select_related('streaming').filter(streaming=index).values("shipping_term").annotate(amount=Count("shipping_term"))

	for order in orders:
		delivery = order["amount"] / orders_num
		delivery_term.append(order["shipping_term"])
		delivery_amounts.append(delivery)
	
	response.append(delivery_term)
	response.append(delivery_amounts)

	print(response)

	return JsonResponse(response, safe=False)

#回傳單場直播的顧客付款比例表現
def get_index_payment(request):

	# 前端回傳數值
	index=request.POST.get('time')
	response=[]

	#初始化參數
	payment_term=[]
	payment_amount=[]

	orders_num = Orders.objects.filter(streaming=index).count()
	orders=Orders.objects.select_related('streaming').filter(streaming=index).values("payment_term").annotate(amount=Count("payment_term"))
	for order in orders:
		payment = order["amount"] / orders_num
		payment_term.append(order["payment_term"])
		payment_amount.append(payment)

	response.append(payment_term)
	response.append(payment_amount)

	print(response)

	return JsonResponse(response, safe=False)

#回傳單場直播的棄單比例表現
def get_index_droporder(request):

	# 前端回傳數值
	index=request.POST.get('time')
	response=[]

	#初始化參數
	status=[]
	status_amounts=[]

	orders_num=Orders.objects.filter(streaming=index).count()
	orders=Orders.objects.select_related('streaming').filter(streaming=index).values("status").annotate(amount=Count("status"))

	for order in orders:
		amounts=order["amount"]/orders_num
		status.append(order["status"])
		status_amounts.append(amounts)

	response.append(status)
	response.append(status_amounts)

	print(response)

	return JsonResponse(response, safe=False)

#回傳單場直播的性別比例表現
def get_index_gender(request):
    # 前端回傳數值
    index=request.POST.get('time')
    response=[]


    select_streaming=Streamings.objects.filter(streaming_id=index)
	

    for streaming in select_streaming:
        response_json=dict(name=streaming.streaming_name,males=streaming.males,
		females=streaming.females)
        response.append(response_json)

    print(response)

    return JsonResponse(response, safe=False)

#回傳單場直播的年齡比例表現
def get_index_age(request):
    # 前端回傳數值
    index=request.POST.get('time')
    response=[]


    select_streaming=Streamings.objects.filter(streaming_id=index)
	

    for streaming in select_streaming:
        response_json=dict(name=streaming.streaming_name,twenty_to_thirty=streaming.age_twenty_to_thirty,
		thirty_to_forty=streaming.age_thirty_to_forty,forty_to_fifty=streaming.age_forty_to_fifty,
		fifty_to_sixty = streaming.age_fifty_to_sixty,sixty_to_seventy = streaming.age_sixty_to_seventy,males = streaming.males,females = streaming.females)

        response.append(response_json)

    print(response)

    return JsonResponse(response, safe=False)


def get_index_chronic_gender(request):
    #前端回傳數值
    begin_time=request.POST.get('begin_time')
    end_time=request.POST.get('end_time')
    # 回傳response
    response = []

    # 用FK做1to1的Left Join Relationship
    stream_datas = Streamings.objects.filter(start_time__range=(begin_time,end_time))

    #初始化要存進資料的array
    males = []
    females = []
	
    #將資料取出放進每個array
    for streaming in stream_datas:
        males.append(streaming.males)
        females.append(streaming.females)

    #丟進response array
    response.append(males)
    response.append(females)
    print(response)

    return JsonResponse(response, safe=False)

def get_index_chronic_age(request):
    #前端回傳數值
    begin_time=request.POST.get('begin_time')
    end_time=request.POST.get('end_time')
    # 回傳response
    response = []

    # 用FK做1to1的Left Join Relationship
    stream_datas = Streamings.objects.filter(start_time__range=(begin_time,end_time))

    #初始化要存進資料的array
    twenty_to_thirty = []
    thirty_to_forty = []
    forty_to_fifty = []
    fifty_to_sixty = []
    sixty_to_seventy = []
    males = []
    females = []
	
    #將資料取出放進每個array
    for streaming in stream_datas:
        twenty_to_thirty.append(streaming.age_twenty_to_thirty)
        thirty_to_forty.append(streaming.age_thirty_to_forty)
        forty_to_fifty.append(streaming.age_forty_to_fifty)
        fifty_to_sixty.append(streaming.age_fifty_to_sixty)
        sixty_to_seventy.append(streaming.age_sixty_to_seventy)
        males.append(streaming.males)
        females.append(streaming.females)

    #丟進response array
    response.append(twenty_to_thirty)
    response.append(thirty_to_forty)
    response.append(forty_to_fifty)
    response.append(fifty_to_sixty)
    response.append(sixty_to_seventy)
    response.append(males)
    response.append(females)
    print(response)

    return JsonResponse(response, safe=False)

#要來做每場直播都可以有 href 連接到更精準狀態
def get_stream_data(request):
	#回傳response
	response=[]

	#用FK做1to1的Left Join Relationship
	stream_datas=StreamingsDetail.objects.all().select_related('streaming')

	for stream_data in stream_datas:
		print(stream_data)
		response_json = dict(streaming_name=stream_data.streaming.streaming_name,
		streaming_time=stream_data.time_record,
		streaming_like=stream_data.streaming.likes,
		streaming_comment=stream_data.streaming.comments,
		streaming_share=stream_data.streaming.shares,
		streaming_views=stream_data.views,
		streaming_orders=stream_data.order_amount)
		response.append(response_json)

	return JsonResponse(response, safe=False)

def post_comment(request):

	print(request)
	# 前端回傳數值
	comments=["我有加單到嗎?","現在是直播嗎?","可以匯款嗎?","可以看前面幾標嗎?"]

	response=[]

	for comment in comments:

		response_json=dict(comment=comment)
		response.append(response_json)

	return JsonResponse(response, safe=False, status=200)

def get_instant_data(request):

	x=random.randint(10,80)

	response=[]

	response.append(x)

	return JsonResponse(response, safe=False, status=200)

#根據時間區段取得數場直播的貼文數據表現
def get_index_chronic_performance(request):
    #前端回傳數值
    begin_time=request.POST.get('begin_time')
    end_time=request.POST.get('end_time')
    reference_index=request.POST.get('bank_index')
    # 回傳response
    response = []
    print(reference_index)

    # 用FK做1to1的Left Join Relationship
    stream_datas = StreamingsDetail.objects.all().select_related('streaming').filter(time_record__range=(begin_time,end_time))

    #初始化要存進資料的array
    streaming_names=[]
    streaming_times=[]
    streaming_likes=[]
    streaming_comments=[]
    streaming_shares=[]
    streaming_order_amounts=[]
    streaming_views=[]

    #將資料取出放進每個array
    for stream_data in stream_datas:
        streaming_names.append(stream_data.streaming.streaming_name)
        streaming_times.append(stream_data.time_record)
        streaming_likes.append(stream_data.streaming.likes)
        streaming_comments.append(stream_data.streaming.comments)
        streaming_shares.append(stream_data.streaming.shares)
        streaming_order_amounts.append(stream_data.order_amount)
        streaming_views.append(stream_data.views)

    #丟進response array
    response.append(streaming_names)
    response.append(streaming_times)
    response.append(streaming_likes)
    response.append(streaming_comments)
    response.append(streaming_shares)
    response.append(streaming_order_amounts)
    response.append(streaming_views)
    print(response)

    return JsonResponse(response, safe=False)

#根據時間區段取得數場直播的配送分布比例
def get_index_chronic_delivery(request):

	#前端回傳數值
	begin_time=request.POST.get('begin_time')
	end_time=request.POST.get('end_time')

	#先把該時段的每一個直播場次挑出來，找出每場直播的配送分布比例，放進三維陣列，回傳此三維陣列
	#將資料型態改成 [{'streaming_name':'丟丟妹','shipping_proportion':[{'shipping_term':'包裹', 'amount': 0.2},{...},..]},{...}]
	#[{'streaming_name': '丟丟妹',
	#  'shipping_distribution': [{'shipping_term': '包裹', 'amount': 1}]},
	# {'streaming_name': '丟丟妹第二場直播',
	#  'shipping_distribution': [{'shipping_term': '包裹', 'amount': 166},{'shipping_term': '商店取貨', 'amount': 1}]},
	# {'streaming_name': '',
	#  'shipping_distribution': [{}] },
	# {},{},{}.......
	#]
	response=[]
	stream_datas = StreamingsDetail.objects.all().select_related('streaming').filter(time_record__range=(begin_time,end_time))

	for stream_data in stream_datas:

		#建立每場直播資料的array
		one_stream_response=[]

		#取得每場直播id
		stream_id=stream_data.streaming.streaming_id
		stream_name=stream_data.streaming.streaming_name
		record_time=stream_data.time_record

		#計算每場直播的訂單總數
		orders_num=Orders.objects.filter(streaming=stream_id).count()

		# 再根據每場直播的數據，放進一個三維陣列
		orders = Orders.objects.filter(streaming=stream_id).values("shipping_term").annotate(amount=Count("shipping_term"))
		
		for order in orders:
			shipping_proportion=(order["amount"]/orders_num)
			one_stream_response_json=dict(x=order["shipping_term"],y=shipping_proportion)
			one_stream_response.append(one_stream_response_json)

		x=random.randint(0,5)
		response_json=dict(label=stream_name,data=one_stream_response,backgroundColor=colors_choice[x])
		response.append(response_json)

	print(response)

	return JsonResponse(response, safe=False)

#根據時間區段取得數場直播的付款分布比例
def get_index_chronic_payment(request):
	#前端回傳數值
	begin_time=request.POST.get('begin_time')
	end_time=request.POST.get('end_time')

	#先把該時段的每一個直播場次挑出來，找出每場直播的配送分布比例，放進三維陣列，回傳此三維陣列
	#[{'streaming_name': '丟丟妹',
	#  'shipping_distribution': [{'payment_term': '信用卡', 'amount': 122}]},
	# {'streaming_name': '丟丟妹第二場直播',
	#  'shipping_distribution': [{'payment_term': '信用卡', 'amount': 155},{'payment_term': '付現', 'amount': 1}]},
	# {'streaming_name': '',
	#  'shipping_distribution': [{}] },
	# {},{},{}.......
	#]
	response=[]
	stream_datas = StreamingsDetail.objects.all().select_related('streaming').filter(time_record__range=(begin_time,end_time))
	
	for stream_data in stream_datas:
		#建立每場直播資料的array
		one_stream_response=[]
		#取得每場直播id
		stream_id=stream_data.streaming.streaming_id
		stream_name=stream_data.streaming.streaming_name
		record_time=stream_data.time_record

		# 計算每場直播的訂單總數
		orders_num = Orders.objects.filter(streaming=stream_id).count()
		# 再根據每場直播的數據，放進一個二維陣列
		orders = Orders.objects.filter(streaming=stream_id).values("payment_term").annotate(amount=Count("payment_term"))
		
		for order in orders:
			payment_proportion=(order["amount"]/orders_num)
			one_stream_response_json=dict(x=order["payment_term"],y=payment_proportion)
			one_stream_response.append(one_stream_response_json)

		x=random.randint(0,5)
		response_json=dict(label=stream_name,data=one_stream_response,backgroundColor=colors_choice[x])
		response.append(response_json)

	print(response)

	return JsonResponse(response, safe=False)

#根據時間區段取得數場直播的單據狀態分布比例
def get_index_chronic_droporder_status(request):

	#前端回傳數值
	begin_time = request.POST.get('begin_time')
	end_time = request.POST.get('end_time')

	#先把該時段的每一個直播場次挑出來，找出每場直播的配送分布比例，放進三維陣列，回傳此三維陣列
	#[{'streaming_name': '丟丟妹',
	#  'shipping_distribution': [{'status': '已付款', 'amount': 122}]},
	# {'streaming_name': '丟丟妹第二場直播',
	#  'shipping_distribution': [{'status': '已付款', 'amount': 155},{'status': '棄單', 'amount': 12}]},
	# {'streaming_name': '',
	#  'shipping_distribution': [{}] },
	# {},{},{}.......
	#]
	response=[]
	stream_datas = StreamingsDetail.objects.all().select_related('streaming').filter(time_record__range=(begin_time,end_time))
	for stream_data in stream_datas:

		#建立每場直播資料的array
		one_stream_response=[]

		#取得每場直播id
		stream_id=stream_data.streaming.streaming_id
		stream_name=stream_data.streaming.streaming_name
		record_time=stream_data.time_record

		# 計算每場直播的訂單總數
		orders_num = Orders.objects.filter(streaming=stream_id).count()

		# 再根據每場直播的數據，放進一個二維陣列
		orders = Orders.objects.filter(streaming=stream_id).values("status").annotate(amount=Count("status"))

		for order in orders:
			droporder_proportion=(order["amount"]/orders_num)
			one_stream_response_json=dict(x=order["status"],y=droporder_proportion)
			one_stream_response.append(one_stream_response_json)

		x=random.randint(0,5)
		response_json=dict(label=stream_name,data=one_stream_response,backgroundColor=colors_choice[x])
		response.append(response_json)

	print(response)

	return JsonResponse(response, safe=False)

@csrf_exempt	 #對此試圖函式新增csrf裝飾器，使得此函式的post請求免驗證token
def chatbot_message(request):

    info=json.loads(request.body.decode('utf-8'))

    #存入DB

    response="200OK"
    #把info傳到 analysis 頁面上

    return JsonResponse(response,safe=False)

def get_comment(request):
    
	response=[]

	time=datetime.datetime.now()
	time_range_1=datetime.timedelta(hours=8)
	time_range_2=datetime.timedelta(seconds=2)

	new_time=time-time_range_2
	print(new_time)
	#取出DB所儲存的留言資訊
	comments=MessageTemp.objects.filter(datetime__gt=new_time)
	
	print(comments)

	for comment in comments:
		print(comment.text)
		response.append(comment.text)

	return JsonResponse(response,safe=False)

 
