from flask import Flask, render_template, request, Response
import json
import redis

app = Flask(__name__)
r = redis.StrictRedis(host="localhost", port=6379, db=0)

@app.route('/predict', methods=['POST'])
def predict():
    input_json =  request.get_json()
    #print(input_json)
    test_str = {'pID':'55', 'sales':20.0, 'storage':54.4, 'purchase_town':74.1, 'purchase_ex':85.5}
    test_json = json.dumps(test_str)
    #print(test_json)
    return test_json

@app.route('/predict-data', methods=['POST'])
def save_predict_data():
    input_json =  request.get_json()
    #data_dic = {"time":20200811, "data":request.get}
    json_data_dict = json.dumps(input_json , ensure_ascii=False).encode('utf-8')
    r.set("predict_data", json_data_dict)

    # get
    json_test_dict = r.get('predict_data').decode('utf-8')
    test_dict2 = dict(json.loads(json_test_dict))

    #print(test_dict2)
    return "Success", 200

if __name__ == '__main__':
    app.run(debug=True)
