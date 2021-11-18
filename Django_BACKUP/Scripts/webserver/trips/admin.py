from django.contrib import admin

# Register your models here.
from .models import Orders
from .models import OrdersDetail
from .models import Products
from .models import Questions
from .models import Streamings
from .models import StreamingsDetail

admin.site.register(Orders)
admin.site.register(OrdersDetail)
admin.site.register(Products)
admin.site.register(Questions)
admin.site.register(Streamings)
admin.site.register(StreamingsDetail)
