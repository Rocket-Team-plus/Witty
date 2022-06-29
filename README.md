# WITTY : your own streaming assistant.

# *Function*
* Streaming Chatbot 
* stratagic cram school


# *Activation*

## venv activatation
```cmd
Django_BACKUP\Scripts\activate
```
## run server
```cmd
cd Django_BACKUP\Scripts\webserver

python manage.py runserver  
```
(Some option command can be used, details are in django document)

# *Details*
## **chatbot**
用來儲存ngrok以及處理chatbot訓練相關資料使用的程式

## **Django_BACKUP**
為虛擬環境，所需package已經附在裡面了，啟動方式如上Activation

### **Djanog_BACKUP\webserver**
儲存前端SERVER以及後端處理程式，無前後端分離，啟動server方式如上Activation

目前內部有一些檔案命名或是Class命名有怪怪的地方，但我們後來沒有考慮到需要維護的用途，所以也沒有怎麼修改了XD

## **order_to_DB**
為操控資料庫的簡單小程式，執行 --help可以看一下Detail裡面有哪些功能
```cmd
python db_operation.py --help
```

# *Update Record*

## **updated 11/22 JC**
* Added searching function to Training Assistant
* The training documentation need to be completed (maybe in iframe?).
## **updated 11/21 JC**
* RFM table added by silverwaves. The scripts is in the chatbot folder. The age and the gender is random given.
* Modify the Training Assistant framework. 

## **updated 11/19 JC**

* Add focus animation with shadow. 
* Modify the topic on the nav-bar
## **update 11/18 JC**
* upload to backup. 
