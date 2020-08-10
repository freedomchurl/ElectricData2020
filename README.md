# ElectricData2020
## 전력데이터 신사업 공모전 2020. 

### 데이터 흐름도 및 전체적인 구조
전반적인 전체 데이터 흐름도는 아래와 같다

![데이터 흐름도](https://github.com/freedomchurl/ElectricData2020/blob/master/Image/Electric_Dataflow.png)
![데이터 흐름도2](https://github.com/freedomchurl/ElectricData2020/blob/master/Image/electric2020.png)


# MySQL DB 설계

### 테이블 Scheme
#### 1. prosumer_info ( 프로슈머의 기본적인 정보가 들어있음 )

|컬럼명|내용|설명|
|------|---|---|
|pID|prosumer id|autoincrement, primary key|
|name|prosumer name|varchar(100)|
|memo|prosumer memo|varchar(4000)|

#### 2. userdata ( 유저로부터 받은 데이터 )

| 컬럼명  | 내용        | 설명                     |
| ------- | ----------- | ------------------------ |
| pID     | prosumer id | foreign key              |
| output  | 생산량      | double                   |
| demand  | 수요량      | double                   |
| storage | 저장량      | Double                   |
| time    | 시간        | Timestamp, DEFAULT NOW() |

- mysql> create table userdata (pID varchar(100), output double, demand double, storage double, time timestamp DEFAULT NOW());

  

#### 3. controldata ( 제어 데이터 )

| 컬럼명        | 내용                  | 설명                     |
| ------------- | --------------------- | ------------------------ |
| pID           | prosumer id           | foreign key              |
| sales         | 판매량                | double                   |
| storage       | 저장량                | double                   |
| purchase_town | 타운 내 구매량        | double                   |
| purchase_ex   | 전력거래소부터 구매량 | double                   |
| time          | 시간                  | timestamp, DEFAULT NOW() |

- mysql> create table controldata (pID varchar(100), storage double, sales double, purchase_town double, purchase_ex double, time timestamp DEFAULT NOW());

