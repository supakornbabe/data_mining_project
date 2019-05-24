# %% Change working directory from the workspace root to the ipynb file location. Turn this addition off with the DataScience.changeDirOnImportExport setting
import matplotlib.pyplot as plt
import pandas as pd
import json
import sys
import os
import pythainlp
from pythainlp.corpus import stopwords
import deepcut
try:
    os.chdir(os.path.join(os.getcwd(), 'code'))
    print(os.getcwd())
except:
    pass


# %%
if 'ไป' in stopwords.words('thai'):
    print('yes')

# %%
text1 = "[CR] :: รีวิว [Mr.Bew Za] พาไปตะลุย HongKong Disneyland Full Day :: [ตอนพิเศษ]"
text2 = 'แอร์เอเซียX เข้าออก Narita Terminal 1หรือ2 ครับ'
text3 = '(เที่ยวโตเกียว) ควรจะไปโอไดบะ ไหมครับ'
text4 = 'รีวิวแบ่งปันตีแผ่ความเยินนอนจากการเดิน Annapurna Base Camp ,Nepal  ไม่เน้นรูปสวย เน้นระบายอารมณ์ล้วนๆ 5555'
text5 = 'ไปเที่ยวนอร์เวย์ ซื้อของฝากอะไรกลับมาดีครับ'
text6 = 'เงินเดือนแอร์,สจ๊วต,นักบินของสายการบินต่างๆนี่เท่าไรคะ'
text7 = '[CR] Review บินไปเที่ยวเชียงราย 3 วัน 2 คืน พักFull House Resort และ Rasa Boutique Hotel Chiang Rai'
text8 = '[SR] ติวเตอร์ตู่อัปเดท ราคาหลุยส์ ชาแนล ปราด้า แอร์แมส โรเล๊กซ์ ฯ มือสอง...ที่ร้าน Sanoya กรุง Tokyo .... เยอะแยะตาลายไปหมดเล'
text9 = 'เพิ่มเติมข้อมูลการเดินทางไปภูสอยดาวด้วยตัวเอง'
text10 = '[SR] Hilton Pattaya กับความเลิศหรู......ที่ไม่เคยเปลี่ยนแปลง'
print(pythainlp.word_tokenize(text1, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text2, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text3, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text4, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text5, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text6, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text7, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text8, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text9, engine='deepcut', whitespaces=False))
print()
print(pythainlp.word_tokenize(text10, engine='deepcut', whitespaces=False))
print()

# %%

# tweets_data_path = 'C:\\Program Files\\Anaconda2\\tweets_bigData_dataAnalytic.json'
tweets_data_path = 'topic.json'
fp = open('test.out','w')
tweets_data = []
tweets_file = open(tweets_data_path, "r")
count = 0
for line in tweets_file:
    try:
        if (line == '\n'):      # skip empty lines
            continue
        count = count + 1
        tweet = json.loads(line)
        tweets_data.append(tweet)
        if count % 100 == 0:
            sys.stdout.write('.')
        if count % 7000 == 0:
            sys.stdout.write('\n')
    except Exception as e:
        print(e)
        continue
print(f"\n{count} tweets read.")
tweets = pd.DataFrame.from_dict(tweets_data)
# tweets['text'] = list(map(lambda tweet: tweet.get('text', None), tweets_data))
tweets.head()
words = {}
for title in tweets['title']:
    for word in pythainlp.word_tokenize(title, engine='deepcut', whitespaces=False):
        if title not in words:
            words[title] = 1
        else:
            words[title] +=1
print(words,file=fp)
