# 웹 대시보드 상세 API



## 1. 요구사항 명세

| ID   | 요구사항                                                     |
| ---- | ------------------------------------------------------------ |
| RQ01 | 전체 프로슈머 정보 가져오기 ( 이름 및 pID만 ) - prosumer 페이지용 |
| RQ02 | 선택한 프로슈머 정보 가져오기 ( pID, 이름, 메모 ) - detail 페이지용 |
| RQ03 | 선택된 프로슈머 이름, 메모 수정하기 - detail 페이지 수정용   |
| RQ04 | 선택된 프로슈머 최근 1달 데이터 가져와서 가공해서 주기       |
| RQ05 | 메인페이지용 실시간 데이터 보여주기 ( 단, 시간 범위 설정이 있고, 시간 설정에 따라 MySQL/Redis로 분기가 이루어짐 ) |
| RQ06 | 실시간 그래프용 모든 프로슈머 실시간 데이터 가져오기 (  Redis만, 6시간 ) |
| RQ07 | 예측 그래프용 모든 프로슈머의 수요/생산량 예측 -> Flask로 요청 |

---



## 2. 요구사항 별 API 명세

* RQ01 - 전체 프로슈머 정보 가져오기 ( 이름 및 pID만 ) - prosumer 페이지용

  | 요청 URL      | Type | Parameter | 응답                                     |
  | ------------- | ---- | --------- | ---------------------------------------- |
  | /prosumer/all | GET  | None      | {status:true,payload:[{pID,name},...{}]} |



* RQ02 - 선택한 프로슈머 정보 가져오기 ( pID, 이름, 메모 ) - detail 페이지용

  | 요청 URL            | Type | Parameter | 응답                                      |
  | ------------------- | ---- | --------- | :---------------------------------------- |
  | /prosumer/getdetail | GET  | pID       | {status:true, payload: {pID, name, memo}} |

  

* RQ03 - 선택된 프로슈머 이름, 메모 수정하기 - detail 페이지 수정용

  | 요청 URL               | Type | Parameter       | 응답          |
  | ---------------------- | ---- | --------------- | ------------- |
  | /prosumer/modifydetail | POST | pID, name, memo | {status:true} |

  

* RQ04 - 선택된 프로슈머 최근 1달 데이터 가져와서 가공해서 주기

  | 요청 URL                | Type | Parameter | 응답 |
  | ----------------------- | ---- | --------- | ---- |
  | /prosumer/getdataildata | GET  | pID       | TBD  |

  

* RQ05 - 메인페이지용 실시간 데이터 보여주기 ( 단, 시간 범위 설정이 있고, 시간 설정에 따라 MySQL/Redis로 분기가 이루어짐 )

  | 요청 URL              | Type | Parameter               | 응답                                           |
  | --------------------- | ---- | ----------------------- | ---------------------------------------------- |
  | /prosumer/getmainlive | GET  | time - {1h,2h,3h,6h,1d} | TBD ( 각 시간에 따른, 요약 데이터 1d는 MySQL ) |

  

* RQ06 - 실시간 그래프용 모든 프로슈머 실시간 데이터 가져오기 (  Redis만, 6시간 )

  | 요청 URL                | Type | Parameter | 응답 |
  | ----------------------- | ---- | --------- | ---- |
  | /prosumer/getdetaillive | GET  | None      | TBD  |

  

* RQ07 - 예측 그래프용 모든 프로슈머의 수요/생산량 예측 -> Flask로 요청 ( 앞으로 6시간 추이 예상 )

  | 요청 URL             | Type | Parameter | 응답 |
  | -------------------- | ---- | --------- | ---- |
  | /prosumer/predictall | GET  | None      | TBD  |

  






