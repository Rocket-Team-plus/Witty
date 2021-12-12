import pandas as pd
import numpy as np
import mysql.connector
import argparse
from dateutil.parser import parse
import random

class db_opreation:
    def __init__(self):
        self.orders_file_path = ''
        self.host = ''
        self.database = ''
        self.user = ''
        self.password = ''
        self.port = ''
        self.connection = ''
        self.orders_file = ''


    def connect_to_DB(self, host, database, user, password, port):
        try:
            # 連接 MySQL/MariaDB 資料庫
            self.connection = mysql.connector.connect(
                host=self.host,  # 主機名稱
                database=self.database,  # 資料庫名稱
                user=self.user,  # 帳號
                password=self.password,  # 密碼
                port=self.port,
                auth_plugin='mysql_native_password')

            if self.connection.is_connected():
                # 顯示資料庫版本
                db_Info = self.connection.get_server_info()
                print("資料庫版本：", db_Info)
                # 顯示目前使用的資料庫
                cursor = self.connection.cursor()
                cursor.execute("SELECT DATABASE();")
                record = cursor.fetchone()
                print("目前使用的資料庫：", record)

        except Exception as e:
            print("資料庫連接失敗：", e)

    def unconnect_to_DB(self):
        if (self.connection.is_connected()):
            self.connection.close()
            print("資料庫連線已關閉")

    def import_orders(self):
        cursor = self.connection.cursor()
        for row in self.orders_file.itertuples():
            time_record = parse(row.time_record).strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute(
                "INSERT INTO orders (customer_name,status,payment_term,delivery_fee,free_delivery,free_delivery_condition,time_record,streaming_id,shipping_term,total_amount,serial_number) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (row.customer_name, "已完成", "信用卡", "200", 0, None, time_record,
                 1, "包裹", row.total_amount, row.serial_number))
            self.connection.commit()
        cursor.close()
        
    def partial_rdm_status_select(self,chosen_streaming_id):
        choose_number = 0
        upper_limit = 100
        rdm_number = random.randint(1,upper_limit)
        if chosen_streaming_id == '1' or chosen_streaming_id == '2':
            if rdm_number<95:
                choose_number = 0
            else:
                choose_number = 3
        else:
            if rdm_number<24:
                choose_number = 1
            elif rdm_number>23 and rdm_number <97:
                choose_number = 2
            else:
                choose_number = 3
        
        return  choose_number

    def partial_rdm_payment_select(self):
        choose_number = 0
        upper_limit = 100
        rdm_number = random.randint(1,upper_limit)
        if(rdm_number<=45):
            choose_number = 0
        elif(rdm_number>45 and rdm_number<=88):
            choose_number = 1
        elif(rdm_number>88 and rdm_number<=90):
            choose_number = 2
        else:
            choose_number = 3
        return  choose_number

    def partial_rdm_shipping_select(self):
        choose_number = 0
        upper_limit = 100
        rdm_number = random.randint(1,upper_limit)
        if(rdm_number<= 3):
            choose_number = 0
        elif(rdm_number>3 and rdm_number<=6):
            choose_number = 1
        elif(rdm_number>6 and rdm_number<=95):
            choose_number = 2
        else:
            choose_number = 3
        return  choose_number    

    def select_term(self,chosen_streaming_id):
        status = ['已完成','已下單','已付款','棄單']
        payment_term = ['信用卡','匯款/轉賬' ,'取貨付款','面交付款']
        shipping_term = ['宅配（常溫）','超商店到店','宅配（冷凍）','面交']
        return {'status':status[self.partial_rdm_status_select(chosen_streaming_id)],'payment_term':payment_term[self.partial_rdm_payment_select()],'shipping_term':shipping_term[self.partial_rdm_shipping_select()]}
       
    def get_orders_with_streamings_id_count(self,chosen_streaming_id):
        cursor = self.connection.cursor()
        cursor.execute(f'SELECT order_id From orders WHERE streaming_id = {chosen_streaming_id} ')
        chosen_id_list = []
        row = [item[0] for item in cursor.fetchall()]
        for temp in row:
            chosen_id_list.append(temp)
        return chosen_id_list
    
    def rdm_assign_db_terms(self, chosen_streaming_id):
        cursor = self.connection.cursor()
       
        for i in self.get_orders_with_streamings_id_count(chosen_streaming_id):
            term_dict = self.select_term(chosen_streaming_id)
            chosen_status = term_dict.get('status')
            chosen_payment_term = term_dict.get('payment_term')
            chosen_shipping_term = term_dict.get('shipping_term')
            #print(f"chosen_status : {chosen_status}, chosen_payment_term : {chosen_payment_term}, chosen_shipping_term: {chosen_shipping_term}")
            sql = """ UPDATE orders SET status = '%s' , payment_term = 
            '%s', shipping_term = '%s' WHERE order_id = '%d' """ %(chosen_status,chosen_payment_term,chosen_shipping_term,i)

            cursor.execute(sql)
            self.connection.commit()

        cursor.close()

    def import_goods_name(self):
        pass

    def delete_col(self, table_name, col_name):
        cursor = self.connection.cursor()
        cursor.execute(f'ALTER TABLE {table_name} DROP COLUMN {col_name}')
        print(f'DROP {col_name} in {table_name}')
        self.connection.commit()
        cursor.close()

    def alter_col_in_table(self, table_name, operation, col_name, col_type):
        cursor = self.connection.cursor()
        cursor.execute(
            f'ALTER TABLE {table_name} {operation} {col_name} {col_type}')
        print(f'{operation} {col_name} in {table_name}')
        self.connection.commit()
        cursor.close()

    def show_table_schema(self, table_name):
        cursor = self.connection.cursor()
        cursor.execute(f'describe {table_name};')
        print(f'Now showing schema of {table_name}')
        for i in cursor:
            print(i)
        cursor.close()

    def show_all_tables(self):
        cursor = self.connection.cursor()
        cursor.execute('show tables;')
        print(f'Now Showing tables:')
        for temp in cursor:
            print(temp)
        cursor.close()

    def show_all_entities(self, table_name):
        cursor = self.connection.cursor()
        cursor.execute(f"SELECT * FROM {table_name}")
        for temp in cursor:
            print(temp)
        cursor.close()

    # getter and setter

    def set_host(self, n_host):
        self.host = n_host

    def set_database(self, n_database):
        self.database = n_database

    def set_user(self, n_user):
        self.user = n_user

    def set_password(self, n_password):
        self.password = n_password

    def set_port(self, n_port):
        self.port = n_port

    def set_orders_file(self):
        self.orders_file = pd.read_excel(
            self.orders_file_path,
            skiprows=2,
            names=[
                'time_record', 'streaming_id', 'serial_number',
                'customer_name', 'product_name', 'standard', 'price',
                'quantity', 'total_amount', 'note'
            ],
        )

    def set_orders_file_path(self, path):
        self.orders_file_path = path

    def get_orders_file(self):
        return self.orders_file

    def get_host(self):
        return self.host

    def get_database(self):
        return self.database

    def get_user(self):
        return self.user

    def get_password(self):
        return self.password

    def get_port(self):
        return self.port


parser = argparse.ArgumentParser()
parser.add_argument("--host", type=str, default="localhost")
parser.add_argument("--database", type=str, default="rocketteam")
parser.add_argument("--user", type=str, default="root")
parser.add_argument("--password", type=str, default="rocketteamplus")
parser.add_argument("--port", type=int, default="3306")

parser.add_argument("--assign_rdm_terms", type=str,nargs = '+',help="assign random terms like status,shipping_terms,payment_terms")

parser.add_argument("--import_orders",
                    help="Import selected orders file into database")

parser.add_argument("--show_table_schema",
                    type=str,
                    nargs='+',
                    help="Show selected table schema.")

parser.add_argument("--show_all_tables",
                    action='store_true',
                    help="Show all the table in the db.")

parser.add_argument("--delete_col",
                    nargs='*',
                    help='Delete selected column in selected table')

parser.add_argument(
    "--alter_col",
    type=str,
    nargs='*',
    help=
    "Alter columns. Rule:--add_simple_col table_name operation column_name column_type"
)

parser.add_argument("--show_all_entities",
                    type=str,
                    nargs='+',
                    help='Show all the entities in selected table')

args = parser.parse_args()
db_opreation = db_opreation()
db_opreation.set_host(args.host)
db_opreation.set_database(args.database)
db_opreation.set_user(args.user)
db_opreation.set_password(args.password)
db_opreation.set_port(args.port)

db_opreation.connect_to_DB(host=db_opreation.get_host(),
                           database=db_opreation.get_database(),
                           user=db_opreation.get_user(),
                           password=db_opreation.get_password(),
                           port=db_opreation.get_port())

if args.assign_rdm_terms:
    db_opreation.rdm_assign_db_terms(args.assign_rdm_terms[0])
    print('assign completed')

if args.import_orders:
    db_opreation.set_orders_file_path(args.import_orders)
    db_opreation.set_orders_file()
    print("Importing ...")
    db_opreation.import_orders()

if args.show_table_schema:
    db_opreation.show_table_schema(args.show_table_schema[0])

if args.show_all_tables:
    db_opreation.show_all_tables()

if args.alter_col:
    db_opreation.alter_col_in_table(args.alter_col[0], args.alter_col[1],
                                    args.alter_col[2], args.alter_col[3])

if args.show_all_entities:
    db_opreation.show_all_entities(args.show_all_entities[0])

if args.delete_col:
    db_opreation.delete_col(table_name=args.delete_col[0],
                            col_name=args.delete_col[1])

db_opreation.unconnect_to_DB()