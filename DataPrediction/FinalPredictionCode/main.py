from flask import Flask, render_template, request, Response
import json
import redis
from keras.models import load_model
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import ControlAlg

prosumer_num = 20
timeslot = 50
min_retail = 0
max_retail = 0

app = Flask(__name__)
r = redis.StrictRedis(host="49.50.167.74", port=6377, password='dlcjf', db=0)

# 프로슈머로 부터 받은 데이터를 통해 제어 데이터 전송.
@app.route('/predict', methods=['POST'])
def predict():
    global timeslot
    global min_retail
    global max_retail

    timeslot = timeslot + 1
    input = request.get_json()
    pID_list = []
    input_Battery = []
    for i in range(0, len(input)):
        pID_list.append(input[i]['pID'])
        input_Battery.append(input[i]['storage'])

    t_input_P, t_input_demand, t_input_generate = dataProcessing(uni_x_retail)

    ##### 여기서 LSTM 으로 예측한 데이터를 Redis 에 저장할 것입니다. ***
    for i in range (0, len(input)):
        data_dic = {"data": t_input_demand[i].tolist()}
        json_data_dict = json.dumps(data_dic, ensure_ascii=False).encode('utf-8')
        r.set("prosumer:"+str(input[i]['pID'])+":predict_demand", json_data_dict)


        data_dic = {"data": t_input_generate[i].tolist()}
        json_data_dict = json.dumps(data_dic, ensure_ascii=False).encode('utf-8')
        r.set("prosumer:"+str(input[i]['pID'])+":predict_output", json_data_dict)


    data_dic = {"data": t_input_P[0].tolist()}
    json_data_dict = json.dumps(data_dic, ensure_ascii=False).encode('utf-8')
    r.set("predict-price", json_data_dict)

    t_current_P =  (uni_x_retail[timeslot-1][71] * (float(max_retail) - float(min_retail))) + float(min_retail)

    input_P = np.hstack((t_current_P.reshape(1, 1),t_input_P))
    input_P = input_P[:,0:12]

    t_current_output_array = []#np.array((10,1),dtype=np.float)
    t_current_demand_array = []#np.array((10,1),dtype=np.float)

    for i in range (0,len(input)):
        t_current_output_array.append(input[i]['output']);
        t_current_demand_array.append(input[i]['demand']);

    t1 = np.array(t_current_output_array)
    t2 = np.array(t_current_demand_array)

    input_demand = np.hstack((np.array(t_current_demand_array).reshape((20,1)), t_input_demand))[:,0:12]
    input_generate = np.hstack((np.array(t_current_output_array).reshape((20,1)), t_input_generate))[:,0:12]

    #print(np.transpose(input_P))
    #print(np.array(input_demand))
    #print(np.array(input_generate))
    #print(np.array(input_Battery))
    #print(np.array(pID_list).shape)
    result = ControlAlg.GetControll(np.transpose(input_P), input_demand, input_generate, input_Battery, pID_list)

    return str(result)

@app.route('/predict-data', methods=['POST'])
def save_predict_data():
    input_json =  request.get_json()
    json_data_dict = json.dumps(input_json , ensure_ascii=False).encode('utf-8')
    r.set("predict_data", json_data_dict)

    # get
    json_test_dict = r.get('predict_data').decode('utf-8')
    test_dict2 = dict(json.loads(json_test_dict))

    return "Success", 200

# LSTM Data Generate
def generateData(a, n):
    x_train = []
    for i in range(len(a)):
        x = a[i:(i + n)]
        if (i + n) < len(a):
            x_train.append(x)
        else:
            break
    return np.array(x_train)

# LSTM Prediction
def dataProcessing(uni_x_retail):
    global timeslot

    x_renewable = []
    x_demand = []

    minMaxScaler = MinMaxScaler()
    for i in range(1, prosumer_num + 1):
        thisx_renewable = r.lrange('prosumer:' + str(i) + ':output', 0, -1)
        thisx_demand = r.lrange('prosumer:' + str(i) + ':demand', 0, -1)

        thisx_demand.reverse()
        thisx_renewable.reverse()

        x_renewable.append(thisx_renewable)
        x_demand.append(thisx_demand)

    min_renew = min(min(x_renewable))
    max_renew = max(max(x_renewable))
    min_demand = min(min(x_demand))
    max_demand = max(max(x_demand))

    print(minMaxScaler.fit(x_renewable))

    uni_x_renew = minMaxScaler.transform(x_renewable)

    print(minMaxScaler.fit(x_demand))

    uni_x_demand = minMaxScaler.transform(x_demand)

    uni_x_renew = np.array(uni_x_renew)
    uni_x_demand = np.array(uni_x_demand)

    uni_x_renew = uni_x_renew.reshape(-1, 72, 1)
    uni_x_demand = uni_x_demand.reshape(-1, 72, 1)

    renew_model = load_model("./renewable.h5")
    y_renew = renew_model.predict(uni_x_renew, batch_size=1)

    demand_model = load_model("./demand_data.h5")
    y_demand = demand_model.predict(uni_x_demand, batch_size=1)

    retail_model = load_model("./retail_price.h5")
    y_retail = retail_model.predict(np.array(uni_x_retail[timeslot], dtype=np.float).transpose(), batch_size=1)

    y_after_renew = np.array(y_renew, dtype=np.float)
    y_after_demand = np.array(y_demand, dtype=np.float)
    y_after_retail = np.array(y_retail, dtype=np.float)

    final_y_renew = (y_after_renew * (float(max_renew) - float(min_renew))) + float(min_renew)
    final_y_demand = (y_after_demand * (float(max_demand) - float(min_demand))) + float(min_demand)
    final_y_retail = (y_after_retail * (float(max_retail) - float(min_retail))) + float(min_retail)

    #print(final_y_renew.shape)
    #print(final_y_demand.shape)
    #print(final_y_retail.shape)

    return np.clip(final_y_retail,0,None),np.clip(final_y_demand,0,None), np.clip(final_y_renew,0,None)

if __name__ == '__main__':

    # load data from csv file
    data = np.loadtxt("./retail_price.csv", delimiter=",")

    # 1D array to 2D array for minmaxScaler
    t_data = data.transpose()
    x_retail = t_data.reshape(50000, 1)

    # data를 0 - 1 사이로
    minMaxScaler = MinMaxScaler()
    print(minMaxScaler.fit(x_retail))
    uni_x_retail = minMaxScaler.transform(x_retail)

    min_retail = min(min(x_retail))
    max_retail = max(max(x_retail))

    # x, y = generateX(uni_data, 84) #72(6시간) - 12 (1시간)
    uni_x_retail = generateData(uni_x_retail, 72)
    uni_x_retail = uni_x_retail.reshape(-1, 72, 1)
    #dataProcessing(x_retail)

    app.run(debug=True)
