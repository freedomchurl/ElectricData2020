from pulp import *
import numpy as np

# input_P는 P_retail값, input_demand는 수요, input_generate는 생산 예측, 앞은 1차원 list, 두개는 2차원 list
# size -> 12, (N,12) , (N,12)
def GetControll(input_P, input_demand, input_generate,input_Battery,pID):
    N = 10;
    # User 수
    # input_P, input_demand, input_generate 는 numpy 배열
    # 아래 변수들처럼, numpy로 구성되어야 한다.
    Town = 54; # 10.68원/kWh
    P_town = np.arange(N*12,dtype=float);
    P_town[:] = Town;
    # Town Price는 고정

    P_retail = np.zeros((1,N*12)).ravel();
    # print(input_P[4])
    # print(input_P[4:6]);
    for i in range(0,12):
        P_retail[i*N:(i+1)*N] = input_P[i];
    # N개씩 ( Prosumer 숫자 만큼 ) 끊어서, 계산한다.

    Input_demand = input_demand.ravel(order='F');
    # 세로 순으로 변경하는 함수 N/N/N/N...

    Input_gene = input_generate.ravel(order='F');
    # 세로 순으로 변경,

    set_BO = range(0,N*12)
    set_BI = range(0,N*12)
    set_SO = range(0,N*12);
    set_SI = range(0,N*12);
    # Set range
    set_Battery = range(0,N*12);


    # 문제를 정의한다
    BO = LpVariable.dicts("BO",set_BO,lowBound=0, cat="Continuous")
    BI = LpVariable.dicts("BI",set_BI,lowBound=0, cat="Continuous")
    SO = LpVariable.dicts("SO", set_SO, lowBound=0, cat="Continuous")
    SI = LpVariable.dicts("SI", set_SI, lowBound=0, cat="Continuous")
    # 변수 4개, geq 0 조건을 추가하면서 생성하였음

    Battery = LpVariable.dicts("BT",set_Battery,lowBound=0,cat="Continuous")

    prob = LpProblem("TOWN", LpMinimize)
    # Make up an objective
    #prob += lpSum([P_retail[i] * (BO[i]-SO[i]) + P_town[i] * (BI[i]-SO[i]-SI[i]) for i in set_BO]);
    prob += (lpSum([(P_retail[i] * (BO[i]) + P_town[i] * (BI[i] - SI[i]-SO[i])) for i in set_BO]));

    # Apply constraints
    # 내부 구매 / 판매의 합은 동일하다
    for t in range(0,12): # 매 시간동안,
        #prob += lpSum([SI[N*t+i]-BI[N*t+i] for i in range(0,N)]) == 0
        prob += (lpSum([SI[N*t+i] for i in range(0,N)]) - lpSum([BI[N*t+i] for i in range(0,N)])) == 0



    #구매량의 합은, 요구전력보다 적어야한다. -> 불필요한 구매-> 저장화를 통한 독과점 방지
    for i in range(0,N*12):
        prob += (BO[i] + BI[i] - Input_demand[i]) <= 0
        #prob += BO[i] - Input_demand[i] <= 0

    for i in range(0,N*12):
        prob += SO[i] <= Input_gene[i] + Battery[i]

    # 모든 유저들에 대하여, 갖다 판 금액보다 사온 금액이 비싸면 안된다.
    # for t in range(0,12):
    #     prob += lpSum([P_retail[N*t+i] * BO[N*t+i] for i in range(0,N)])  <=  lpSum([P_town[N*t+i] * SI[N*t+i] for i in range(0,N)])

    # 초기 배터리 설정 - Its okay
    for i in range(0,N):
        prob += (Battery[i] - input_Battery[i]) == 0


    # 어쨋든 갖고 있는 에너지가, 필요 에너지보다는 커야한다.
    for i in range(0,N*12):
        prob += (Battery[i] + Input_gene[i] + BO[i] + BI[i] - SO[i] - SI[i]) >= Input_demand[i]

    # 배터리 업데이트 -
    for i in range(0, N * 11):
        print(i)
        prob += (Battery[i+N]) == Battery[i] + Input_gene[i] + BO[i] + BI[i] - SO[i] - SI[i] - Input_demand[i]

    #print(prob.objective)
    #prob.writeLP("aa.lp")
    prob.solve();
    # Print results:
    BO_sol = np.array([BO[i].varValue for i in set_BO])
    # print(("Status:"), LpStatus[prob.status])
    # print("BO_soln: ")
    # print(BO_sol)

    BI_sol = np.array([BI[i].varValue for i in set_BI])
    # print(("Status:"), LpStatus[prob.status])
    # print("BI_soln: ")
    # print(BI_sol)

    SO_sol = np.array([SO[i].varValue for i in set_SO])
    # print(("Status:"), LpStatus[prob.status])
    # print("SO_soln: ")
    # print(SO_sol)

    SI_sol = np.array([SI[i].varValue for i in set_SI])
    # print(("Status:"), LpStatus[prob.status])
    # print("SI_soln: ")
    # print(SI_sol)

    BT_sol = np.array([Battery[i].varValue for i in set_Battery])
    # print(("Status:"), LpStatus[prob.status])
    # print("BT_soln: ")
    # print(BT_sol)
    controlData = [];
    for i in range(0, N):
        ST = Input_gene[i] + BO_sol[i] + BI_sol[i] - SI_sol[i] - SO_sol[i] - Input_demand[i];
        tmpData = {"pID": pID[i], "sales_town": SI_sol[i], "sales_ex": SO_sol[i], "purchase_ex": BO_sol[i],
                   "purchase_town": BI_sol[i], 'storage': ST}

        controlData.append(tmpData)

    strt = json.dumps(controlData);
    print(strt)
    return strt

    # controlData = [];
    # for i in range(0,N):
    #     foroneUser = [];
    #     for t in range(0,12):
    #         ST = Input_gene[i+N*t] + BO_sol[i+N*t] + BI_sol[i+N*t] - SI_sol[i+N*t] - SO_sol[i+N*t]-Input_demand[i+N*t];
    #         tmpData = {"pID":pID[i],"sales_town":SI_sol[i+N*t],"sales_ex":SO_sol[i+N*t],"purchase_ex":BO_sol[i+N*t],
    #                    "purchase_town":BI_sol[i+N*t], 'storage': ST}
    #         tmpDat = {"pID":pID[i],"sales_town":SI_sol[i+N*t],"sales_ex":SO_sol[i+N*t],"purchase_ex":BO_sol[i+N*t],
    #                "purchase_town":BI_sol[i+N*t], 'this-storage': ST, "demand":Input_demand[i+N*t],"generate":Input_gene[i+N*t],
    #        "P-retail":P_retail[i+N*t],"P-town":P_town[i+N*t],"Current-Battery":BT_sol[i+N*t],"Next-Battery":BT_sol[i+N*t]+ST}
    #
    #         if tmpDat["sales_town"]!=0 or tmpDat["sales_ex"]!=0 or tmpDat["purchase_town"]!=0:
    #         #if i==0:
    #             print(t)
    #             print(tmpDat)
    #         foroneUser.append(tmpData)
    #
    #     controlData.append(foroneUser)
    #
    # ST = Input_gene[0] + BO_sol[0] + BI_sol[0] - SI_sol[0] - SO_sol[0]-Input_demand[0];
    # # print({"pID":pID[0],"sales_town":SI_sol[0],"sales_ex":SO_sol[0],"purchase_ex":BO_sol[0],
    # #                "purchase_town":BI_sol[0], 'this-storage': ST, "demand":Input_demand[0],"generate":Input_gene[0],
    # #        "P-retail":P_retail[0],"P-town":P_town[0],"Curent-Battery":BT_sol[0]})
    # strt = json.dumps(controlData);
    # # print(strt)
    # return strt

# N = 10
# input_P = np.arange(12); # P_retail
# input_demand = np.ones((N,12))
# input_generate = np.ones((N,12))
# current_Battery = np.arange(N);
# # 서버로부터 받아온다.
#
#
#
# input_P = np.array([[52.63      ]
#  ,[53.0110455 ]
#  ,[53.32314753]
#  ,[53.64651592]
#  ,[53.744]
#  ,[53.54496268]
#  ,[53.4915353 ]
#  ,[53.41620165]
#  ,[53.57800395]
#  ,[53.69456088]
#  ,[53.76443382]
#  ,[53.8336]])
#
# input_demand = np.array([[133.18937841, 101.77521055, 102.45654209, 102.75563993 ,102.10430616,
#   102.54197954, 103.61049774, 102.97800925, 103.06702292, 104.19681635,
#   103.34213871, 104.46664292],
#  [186.01135728 ,103.00529517 ,103.14542051, 103.84928339, 103.44434041,
#   104.46851719, 105.00312673, 104.57527939 ,104.71906662 ,105.67382618,
#   105.40741114, 106.6718549 ],
#  [208.44437239 , 90.41144981,  90.35113868 , 89.58979107,  90.07856578,
#    89.01528368 , 88.65412653,  89.29460668 , 88.75291312,  88.08269256,
#    88.63656822 , 87.5336132 ],
#  [134.1914524 ,  93.92848284,  94.47970607,  93.78625778 , 93.27029519,
#    92.40416139 , 92.0020729 ,  92.88151036 , 91.91247543 , 91.20175813,
#    91.3826098 ,  91.02315218],
#  [132.51230426 ,104.16713821 ,104.46234027 ,105.06195629, 104.68651591,
#   105.57957398 ,106.22749556 ,105.63782898 ,106.06751353, 107.15128157,
#   106.77169624 ,107.89184177],
#  [187.44879379 ,102.22902464 ,102.61169012, 103.28620775, 102.88883212,
#   103.73426445 ,104.2944573 , 104.06497348 ,104.15893207 ,104.90146286,
#   104.82816016 ,105.98187702],
#  [132.99213203 ,102.91820174 ,102.98180084, 103.87415169, 103.17782961,
#   104.40356901, 104.97888416 ,104.48231627, 104.62473204, 105.55676546,
#   105.53182523 ,107.00896634],
#  [119.62692926 , 94.85061,  94.97112867 , 94.78718932,  94.01088328,
#    93.88439181 , 93.49368237 , 93.67737003 , 93.06951495 , 92.8190119,
#    92.77435457 , 93.02784088],
#  [175.7734617 , 102.83835375, 103.09549027, 104.00021836, 103.14693853,
#   104.38326339 ,104.82210009,104.45647601, 104.46433583, 105.36881308,
#   105.15842242 ,106.78967295],
#  [127.40846587 , 98.06558614 , 98.69964085 , 98.66964161, 100.0108631,
#    99.53473721 ,100.35743513, 100.45188663, 101.05225391, 100.88275907,
#   101.20708692 ,100.41493588]])
#
# input_generate = np.array([[ 4.25303555e-01, 1.91494997e+00, 2.08194176e+00, 2.31862378e+00
# , 2.34270014e+00,1.56232393e+00,8.67236007e-01,1.14922569e-02
# ,-2.35120200e-01,1.45215719e-02,1.07042287e+00,1.87654023e+00],
#  [ 5.51779643e-01,4.11923406e-01,5.50661784e-01, -1.65556723e-01
# , 4.06421651e-01,1.14589729e+00,1.58981854e+00,1.56722174e+00
# , 1.76991062e+00,1.15293325e+00,6.68434744e-01 ,-1.28687367e-01],
#  [ 8.92935208e-03,1.03409856e+00,1.88910457e+00,1.65945732e+00
# , 1.28039566e+00,5.32395859e-01,5.43095508e-01,9.42343912e-01
# , 2.11921999e+00,2.74107322e+00,2.85504266e+00,1.37772006e+00],
#  [ 1.51738205e-01,2.75770773e+00,1.54686587e+00,1.41503477e+00
# , 1.71677793e+00,2.62481141e+00,2.47818366e+00,2.18661977e+00
# , 1.13576087e+00,5.42396064e-01,3.44775395e-01,1.78428508e+00],
#  [ 3.91345758e-03,1.01521216e+00,1.42906547e+00,8.35113035e-01
# , 6.94573327e-01,9.24144572e-01,1.65990117e+00,2.32240358e+00
# , 2.88490647e+00,2.49250651e+00,1.73725052e+00,6.25591806e-01],
#  [ 1.07855441e-02,2.07800684e+00,1.91503791e+00,1.73596063e+00
# , 1.60701258e+00,1.23979913e+00,8.01043439e-01,4.48771797e-01
# , 3.62860324e-01,5.28360949e-01,1.17518689e+00,2.05117541e+00],
#  [ 2.17325672e-02,7.54284563e-01,5.96070154e-01,9.31083773e-01
# , 1.18155300e+00,1.15083811e+00,7.08033531e-01,1.83848629e-01
# ,-3.10759380e-01, -4.67271076e-01, -3.49382630e-01 ,-3.14958456e-02],
#  [ 1.90966063e-02,9.38564556e-01,1.23174192e+00,1.10131949e+00
# , 6.24545346e-01,1.24416211e-01,3.50417178e-02,2.88286271e-01
# , 6.97316382e-01,8.45964763e-01,7.78634755e-01,3.02641689e-01],
#  [ 2.17084436e-02,1.06187160e+00,2.07901422e+00,2.32392437e+00
# , 2.61594887e+00,2.55679931e+00,3.02420418e+00,3.41228988e+00
# , 4.10074135e+00,4.16420102e+00,3.77695291e+00,1.98441894e+00],
#  [ 2.05430020e-01,1.58557268e-01,8.71281741e-02,7.68148949e-02
# , 2.88939483e-01,1.95615574e-01, -3.91018096e-02 ,-4.84312770e-01
# ,-6.14814346e-01 ,-5.49029818e-01, -1.02375924e-01,2.63689403e-02]])
# # input_P는 전력거래소가격량 12*1 numpy 배열 -> Flask에서 Request 한번 마다 "순서대로" 가져와야 함 어제 준 csv파일
# # input_demand는 LSTM 예측 수요량 N * 12 numpy
# # input_generate는 LSTM 생산 예측량 N * 12 numpy
# # current_Battery는 현재 배터리 저장 N * 1 numpy
# # pID는 현재 준 데이터의 순서와 동일한 순서대로 list로 넘겨준다.
#
# current_Battery = np.array([232.2944174,  232.14413431, 275.98036588, 207.34506624 ,288.21555587
#  ,210.2320903 , 289.54717006, 262.10289664 ,203.91570361 ,242.13321012])
# pID = list(range(0,10))
#
# print(input_P[0])
# print(input_demand[0])
# print(input_generate[0])
# print(current_Battery[0])
#
# GetControll(input_P,input_demand,input_generate,current_Battery,pID);