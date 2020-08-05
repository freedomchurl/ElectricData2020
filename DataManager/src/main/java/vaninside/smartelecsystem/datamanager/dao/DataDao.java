package vaninside.smartelecsystem.datamanager.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.boot.json.JsonParseException;
import org.springframework.boot.json.JsonParser;
import org.springframework.stereotype.Repository;

@Repository
public class DataDao implements IDataDao{
	// MySQL Info
	private String driver = "com.mysql.cj.jdbc.Driver";
	private String url = "jdbc:mysql://localhost:3306/electric_data?serverTimezone=UTC&characterEncoding=UTF-8";
		
	private String userid = "root";
	private String userpw = "jimin5238";
		
		
	private Connection conn = null;
	private PreparedStatement pstmt = null;
	private ResultSet rs =null;
	
	public DataDao() {
		try {
			// JDBC
			Class.forName(driver);
			conn = DriverManager.getConnection(url, userid, userpw);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public boolean insertInput(String msg) {
		JSONParser parser = new JSONParser();
		JSONObject obj = new JSONObject();
		
		try {
			obj = (JSONObject) parser.parse(msg);
		} catch (ParseException e1) {
			e1.printStackTrace();
			return false;
		}
		
		String sql = "INSERT INTO userdata (pID, output, demand, storage) VALUES(?,?,?,?)";
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, (String) obj.get("pID"));
			pstmt.setDouble(2, (Double) obj.get("output"));
			pstmt.setDouble(3, (Double) obj.get("demand"));
			pstmt.setDouble(4, (Double) obj.get("storage"));
			pstmt.executeUpdate();
			
			pstmt.close();
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public boolean insertOutput(String msg) {
		JSONParser parser = new JSONParser();
		JSONObject obj = new JSONObject();
		
		try {
			obj = (JSONObject) parser.parse(msg);
		} catch (ParseException e1) {
			e1.printStackTrace();
			return false;
		}
		
		String sql = "INSERT INTO controldata (pID, storage, sales, purchase_town, purchase_ex) VALUES(?,?,?,?,?)";
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, (String) obj.get("pID"));
			pstmt.setDouble(2, (Double) obj.get("storage"));
			pstmt.setDouble(3, (Double) obj.get("sales"));
			pstmt.setDouble(4, (Double) obj.get("purchase_town"));
			pstmt.setDouble(5, (Double) obj.get("purchase_ex"));
			pstmt.executeUpdate();
			
			pstmt.close();
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}


}
