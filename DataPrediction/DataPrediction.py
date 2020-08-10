from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    input_json =  request.get_json()
    #print(input_json)
    test_str = {'pID':'PROSUMER03', 'sales':20.0, 'storage':54.4, 'purchase_town':74.1, 'purchase_ex':85.5}
    test_json = json.dumps(test_str)
    #print(test_json)
    return test_json

if __name__ == '__main__':
    app.run(debug=True)
