
# coding: utf-8

# In[55]:


import json
import os


# In[56]:


# Load Data to data_store


# In[58]:


# file_list=os.listdir("../Data")
# print(file_list)

data_store=[]
for file in ['ptlog_20181015.json']:
    if file == ".DS_Store":
        continue
    print(file,end=" ")
    fo = open("../Data/" + file, "r")
    for line in fo:
        line = line.replace("{'", '{"')
        line = line.replace("'}", '"}')
        line = line.replace("':", '":')
        line = line.replace(":'", ':"')
        line = line.replace("',", '",')
        line = line.replace(",'", ',"')
        line = line.replace("['", '["')
        line = line.replace("']", '"]')
        line = line.replace(" '", ' "')
        line = line.replace("[None,", '["None",')
        # @Todo #1 Fix link 'https://www.google.co.th/search?q="Coleman+ecodome+5"&oq="Coleman+ecodome+5"&gs_l=mobile-heirloom-serp.12..30i10.5393.42792.0.43919.25.19.3.3.3.0.437.3699.1j11j6j0j1.19.0....0...1c.1j4.34.mobile-heirloom-serp..5.20.3101.60TxhGRMC1o' Problem
        print(line)
        data_store.append(json.loads(line))
    print("Finish")


# In[35]:


print(data_store)

