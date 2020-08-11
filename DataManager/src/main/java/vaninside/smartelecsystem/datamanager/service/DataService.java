package vaninside.smartelecsystem.datamanager.service;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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
public class DataService implements IDataService{

	public static String topic = "topic2";
	
	@Autowired
	DataDao dao;
	
	@Override
	public boolean sendControlData(String msg) {
		MqttMessage mqttMessage = new MqttMessage();
		mqttMessage.setPayload(msg.getBytes());
		try {
			DataController.instance.publish(topic, mqttMessage);
		} catch (MqttPersistenceException e) {
			e.printStackTrace();
			return false;
		} catch (MqttException e) {
			e.printStackTrace();
			return false;
		}
		
		return dao.insertOutput(msg);
	}
	
	public String predict(String msg) throws JsonProcessingException{

		System.out.println(msg);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		RestTemplate restTemplate = new RestTemplate();
		
		String url = "http://localhost:5000/predict";
		
		HttpEntity<String> entity = new HttpEntity<>(msg,headers);
		String answer = restTemplate.postForObject(url, entity, String.class);
		
		System.out.println(answer);
		
		return answer;

	}

	@Override
	public boolean control(String msg) {
		String controlData;
		// userData 저장
		boolean result = dao.insertInput(msg);
		if(result) {
			// control Data 요청
			try {
				controlData = predict(msg);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
				return false;
			}
			// control Data 저장
			 return sendControlData(controlData);
		}
		else return false;
	}	
}
