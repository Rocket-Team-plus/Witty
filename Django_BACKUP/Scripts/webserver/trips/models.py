# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class MessageTemp(models.Model):
    message_id = models.AutoField(primary_key=True)
    user_id = models.CharField(max_length=20)
    text = models.TextField(blank=True, null=True)
    datetime = models.DateTimeField()
    intents = models.CharField(max_length=20, blank=True, null=True)
    entities = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'message_temp'


class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=45)
    status = models.CharField(max_length=45)
    payment_term = models.CharField(max_length=45)
    delivery_fee = models.CharField(max_length=45)
    free_delivery = models.IntegerField()
    free_delivery_condition = models.CharField(max_length=45, blank=True, null=True)
    time_record = models.DateTimeField()
    streaming = models.ForeignKey('Streamings', models.DO_NOTHING)
    shipping_term = models.CharField(max_length=45)
    total_amount = models.IntegerField(blank=True, null=True)
    serial_number = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orders'


class OrdersDetail(models.Model):
    order_detail_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Orders, models.DO_NOTHING)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    quantity = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'orders_detail'


class Products(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_bid = models.IntegerField()
    product_name = models.CharField(max_length=45)
    product_pronoun = models.CharField(max_length=45)
    picture = models.CharField(max_length=45, blank=True, null=True)
    product_color = models.CharField(max_length=45, blank=True, null=True)
    product_type = models.CharField(max_length=45)
    inventory = models.IntegerField()
    price = models.IntegerField()
    preorder = models.IntegerField()
    quantity_sold = models.IntegerField()
    product_category = models.CharField(max_length=45)
    price_store = models.IntegerField(blank=True, null=True)
    product_details = models.CharField(max_length=45, blank=True, null=True)
    suggestions = models.CharField(max_length=45, blank=True, null=True)
    remark = models.CharField(max_length=45, blank=True, null=True)
    keyword = models.CharField(max_length=45, blank=True, null=True)
    discount = models.FloatField()
    streaming = models.ForeignKey('Streamings', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'products'


class Questions(models.Model):
    question_id = models.AutoField(primary_key=True)
    question_type = models.CharField(max_length=45, blank=True, null=True)
    question_number = models.CharField(max_length=45, blank=True, null=True)
    streaming_detail = models.ForeignKey('StreamingsDetail', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'questions'


class Streamings(models.Model):
    streaming_id = models.AutoField(primary_key=True)
    streaming_name = models.CharField(max_length=45)
    streaming_type = models.CharField(max_length=45, blank=True, null=True)
    selling_way = models.CharField(max_length=45, blank=True, null=True)
    selling_style = models.CharField(max_length=45)
    start_time = models.DateTimeField()
    next_time = models.DateTimeField(blank=True, null=True)
    pay = models.CharField(max_length=45)
    delivery = models.CharField(max_length=45)
    delivery_home = models.CharField(max_length=45, blank=True, null=True)
    delivery_frozen = models.CharField(max_length=45, blank=True, null=True)
    delivery_stroe = models.CharField(max_length=45, blank=True, null=True)
    free_shipping = models.IntegerField()
    freeshipping_goal = models.IntegerField(blank=True, null=True)
    discount = models.IntegerField()
    discount_content = models.CharField(max_length=45, blank=True, null=True)
    broadcaster_buy = models.CharField(max_length=45, blank=True, null=True)
    fast_send = models.DateTimeField(blank=True, null=True)
    fast_face = models.DateTimeField(blank=True, null=True)
    likes = models.IntegerField()
    comments = models.IntegerField()
    shares = models.IntegerField()
    males= models.IntegerField()
    females = models.IntegerField()
    age_twenty_to_thirty = models.IntegerField()
    age_thirty_to_forty = models.IntegerField()
    age_forty_to_fifty = models.IntegerField()
    age_fifty_to_sixty = models.IntegerField()
    age_sixty_to_seventy = models.IntegerField()
    class Meta:
        managed = False
        db_table = 'streamings'


class StreamingsDetail(models.Model):
    streaming_detail_id = models.AutoField(primary_key=True)
    order_amount = models.IntegerField()
    views = models.IntegerField()
    time_record = models.DateTimeField()
    streaming = models.ForeignKey(Streamings, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'streamings_detail'