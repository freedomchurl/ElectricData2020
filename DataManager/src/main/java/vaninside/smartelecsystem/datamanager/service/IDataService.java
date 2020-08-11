package vaninside.smartelecsystem.datamanager.service;

public interface IDataService {
	boolean sendControlData(String msg);
	boolean control(String msg);
}
