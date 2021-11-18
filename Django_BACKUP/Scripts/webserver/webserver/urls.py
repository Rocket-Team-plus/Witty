"""webserver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from trips.views import hello_world
from trips.views import training_data
from trips.views import get_data
from trips.views import get_index
from trips.views import get_index_product
from trips.views import get_index_order
from trips.views import get_index_chronic_order
from trips.views import get_index_delivery
from trips.views import get_index_payment
from trips.views import get_index_droporder
from trips.views import get_stream_data
from trips.views import post_comment
from trips.views import get_index_chronic_performance
from trips.views import get_index_chronic_delivery
from trips.views import get_index_chronic_payment
from trips.views import get_index_chronic_droporder_status
from trips.views import test_polling
from trips.views import get_index_chronic_order_bid
from trips.views import fill_form
from trips.views import get_instant_data
from trips.views import chatbot_message
from trips.views import training_action
from trips.views import get_comment
from trips.views import get_index_gender
from trips.views import get_index_age
from trips.views import get_index_chronic_age
from trips.views import get_index_chronic_gender

urlpatterns = [
    path('admin/', admin.site.urls),
    path('analysis/', hello_world),
    path('training_data/', training_data),
    path('test_polling/', test_polling, name='test_polling'),
    path('get_data/', get_data, name='get_data'),
    path('analysis/get_index/', get_index, name='get_index'),
    path('analysis/get_index_product/', get_index_product, name='get_index_product'),
    path('analysis/get_index_order/', get_index_order, name='get_index_order'),
    path('analysis/get_index_chronic_order/', get_index_chronic_order, name='get_index_chronic_order'),
    path('analysis/get_index_delivery/', get_index_delivery, name='get_index_delivery'),
    path('analysis/get_index_payment/', get_index_payment, name='get_index_payment'),
    path('analysis/get_index_droporder/', get_index_droporder, name='get_index_droporder'),
    path('analysis/get_index_gender/', get_index_gender, name='get_index_gender'),
    path('analysis/get_index_age/', get_index_age, name='get_index_age'),
    path('analysis/get_stream_data/',get_stream_data, name='get_stream_data'),
    path('analysis/post_comment/', post_comment, name='post_comment'),
    path('analysis/get_index_chronic_performance/', get_index_chronic_performance, name='get_index_chronic_performance'),
    path('analysis/get_index_chronic_delivery/', get_index_chronic_delivery, name='get_index_chronic_delivery'),
    path('analysis/get_index_chronic_payment/', get_index_chronic_payment, name='get_index_chronic_payment'),
    path('analysis/get_index_chronic_droporder_status/', get_index_chronic_droporder_status, name='get_index_chronic_droporder_status'),
    path('analysis/get_index_chronic_order_bid/',get_index_chronic_order_bid,name='get_index_chronic_order_bid'),
    path('analysis/get_index_chronic_gender/',get_index_chronic_gender,name='get_index_chronic_age'),
    path('analysis/get_index_chronic_age/',get_index_chronic_age,name='get_index_chronic_age'),
    path('fill_form/',fill_form,name='fill_form'),
    path('analysis/get_instant_data', get_instant_data, name='get_instant_data'),
    path('chatbot_message/',chatbot_message,name='chatbot_message'),
    path('analysis/get_comment/',get_comment,name='get_comment'),
    path('training_data/training_action/',training_action,name='training_action'),
    
]