package vaninside.smartelecsystem.datamanager.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import vaninside.smartelecsystem.datamanager.controller.DataController;
import vaninside.smartelecsystem.datamanager.dao.DataDao;

@Service
public class DataService{

	public static ArrayList<String> input;
	public static int PROSUMER_NUM = 10;
	public static int preData = 0;
	
	@Autowired
	DataDao dao;
	
	public DataService() {
		input = new ArrayList<>();
	}
	
	public boolean sendControlData(String msg, String pID) {
		//System.out.println(msg);
		MqttMessage mqttMessage = new MqttMessage();
		mqttMessage.setPayload(msg.getBytes());
		try {
			DataController.instance.publish("topic"+pID, mqttMessage);
		} catch (MqttPersistenceException e) {
			e.printStackTrace();
			return false;
		} catch (MqttException e) {
			e.printStackTrace();
			return false;
		}
		dao.insertOutput(msg);
		return true;
	}
	
	public String predict() throws JsonProcessingException{
		JSONArray jsonArray = new JSONArray();
		for (int i = 0; i < input.size(); i++)//배열
		{
		JSONParser parser = new JSONParser();
		Object obj;
		try {
			obj = parser.parse( input.get(i) );
			JSONObject jsonObj = (JSONObject) obj;
			jsonArray.add(obj);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		}
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		RestTemplate restTemplate = new RestTemplate();
		
		String url = "http://localhost:5000/predict";
		
		HttpEntity<JSONArray> entity = new HttpEntity<>(jsonArray,headers);
		String answer = restTemplate.postForObject(url, entity, String.class);
		System.out.println(answer);
		answer = answer.replaceAll("'", "\"");
		JSONParser jsonP = new JSONParser();
		try {
			JSONArray jsonObj = (JSONArray) jsonP.parse(answer);
			
			for(int i=0;i<jsonObj.size();i++) {
				JSONObject obj = (JSONObject) jsonObj.get(i);
				System.out.println(jsonObj.get(i));
				sendControlData(jsonObj.get(i).toString(), (String) obj.get("pID"));
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return null;
	}

	
	public boolean control(String msg) {
		String controlData;
		// userData 저장
		boolean result = dao.insertInput(msg);
		preData += 1;
		//System.out.println(preData);
		// && preData > (72 * PROSUMER_NUM)
		if(result) {
			// control Data 요청
			try {
				input.add(msg);

				if(input.size() == PROSUMER_NUM) {
					predict();
					input.clear();
				}
				
			} catch (JsonProcessingException e) {
				e.printStackTrace();
				return false;
			}
			
		}
		else return false;
		return true;
	}	
}
