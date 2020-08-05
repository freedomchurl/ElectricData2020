package vaninside.smartelecsystem.datamanager.dao;

import java.io.File;

public interface IDataDao {
	boolean insertInput(String msg);
	boolean insertOutput(String msg);
	
}
