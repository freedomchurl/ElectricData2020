package vaninside.smartelecsystem.datamanager.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import vaninside.smartelecsystem.datamanager.service.DataService;

@RestController
@EnableAutoConfiguration
public class DataController {
	
	@Autowired
	DataService service;
	
	public static String topic = "topic";
	
	private static final String MQTT_PUBLISHER_ID = "electric-data-server";
    private static final String MQTT_SERVER_ADDRES= "tcp://localhost:1883";
    
    public static IMqttClient instance;
   
    
	public DataController() throws MqttException{
		init();	
	}
	
	public void init(){
		// Mqtt Initialize
        if (instance == null) {
            try {
				instance = new MqttClient(MQTT_SERVER_ADDRES, MQTT_PUBLISHER_ID);
				
				MqttConnectOptions options = new MqttConnectOptions();
		        options.setAutomaticReconnect(true);
		        options.setCleanSession(true);
		        options.setConnectionTimeout(10);

		        if (!instance.isConnected()) {
		            instance.connect(options);
		            instance.setCallback(new MqttCallback() {
						@Override
						public void connectionLost(Throwable cause) {}

						@Override
						public void messageArrived(String topic, MqttMessage message) throws Exception {
							System.out.println(message.toString());
							control(message.toString());
						}

						@Override
						public void deliveryComplete(IMqttDeliveryToken token) {}
		            }); 
		        }
		        // Subscribe to topic
		        instance.subscribe(topic);
			} catch (MqttException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}                
        }

        
	}

	
	// User Input < - > Control Output
	@RequestMapping(value="/control", method=RequestMethod.GET)
	public HashMap<String, Object> control(@RequestBody String msg) throws IOException, ClassNotFoundException, SQLException {
		
		boolean result = service.control(msg);

		// return json
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
        hashMap.put("status", result?1:0);
        return hashMap;
	}
}
