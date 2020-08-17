from flask import Flask, render_template, request, Response
import json
import redis

app = Flask(__name__)
r = redis.StrictRedis(host="localhost", port=6379, db=0)

@app.route('/predict', methods=['POST'])
def predict():
    input_json =  request.get_json()
    print(input_json)
    test_str = {'pID':'55', 'sales':20.0, 'storage':54.4, 'purchase_town':74.1, 'purchase_ex':85.5}
    b = [];
    for i in range(0,10):
        b.append({'pID': str(i+1), 'sales_town':0.3, 'sales_ex':0.4, 'purchase_ex':0.5, 'purchase_town':0.7, 'storage':0.13})

    strt = json.dumps(b);
    print(strt)
    test_str_2 = "[{'output': 0.47727466041859645, 'pID': '10', 'storage': 0.3878819324098659, 'demand': 0.38413938268046244}, {'output': 0.8286703625523462, 'pID': '8', 'storage': 0.8348651383214103, 'demand': 0.380108179537878}, {'output': 0.6798935332828564, 'pID': '4', 'storage': 0.04652230623372211, 'demand': 0.7734699924763366}, {'output': 0.5693561263041556, 'pID': '3', 'storage': 0.23065692467878218, 'demand': 0.17491095200648465}, {'output': 0.15556196032228908, 'pID': '2', 'storage': 0.3413887258033823, 'demand': 0.2614996256886133}, {'output': 0.9038344605482507, 'pID': '7', 'storage': 0.570554705796356, 'demand': 0.6936484217051293}, {'output': 0.19498558032264657, 'pID': '5', 'storage': 0.163640544037295, 'demand': 0.47056028100460634}, {'output': 0.7879243728006282, 'pID': '6', 'storage': 0.9651792692268557, 'demand': 0.7057652644918095}, {'output': 0.8500726199164581, 'pID': '9', 'storage': 0.47590839257825057, 'demand': 0.3253595248349139}, {'output': 0.7067388801797052, 'pID': '1', 'storage': 0.9285419062996008, 'demand': 0.28556240739627725}]"
    test_json = json.dumps(test_str)
    #print(test_json)
    return strt

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
