package vaninside.smartelecsystem.datamanager.service;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vaninside.smartelecsystem.datamanager.controller.DataController;
import vaninside.smartelecsystem.datamanager.dao.DataDao;

@Service
public class DataService implements IDataService{

	public static String topic = "topic";
	
	@Autowired
	DataDao dao;
	
	@Override
	public boolean saveUserData(String msg) {
		return dao.insertInput(msg);
	}

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
}
