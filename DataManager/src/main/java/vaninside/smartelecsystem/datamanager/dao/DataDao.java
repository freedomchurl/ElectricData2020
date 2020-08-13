package vaninside.smartelecsystem.datamanager.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParseException;
import org.springframework.boot.json.JsonParser;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.stereotype.Repository;

@Repository
public class DataDao{
	// MySQL Info
	private String driver = "com.mysql.cj.jdbc.Driver";
	//private String url = "jdbc:mysql://localhost:3306/electric_data?serverTimezone=UTC&characterEncoding=UTF-8";
	//private String url = "jdbc:mysql://49.50.175.17:3306/electric_data?serverTimezone=UTC&characterEncoding=UTF-8";
	private String url = "jdbc:mysql://49.50.175.17:3306/electric_data?serverTimezone=UTC&characterEncoding=UTF-8";
	
	private String userid = "root";
	private String userpw = "password";
	
	private static int MAX_SIZE = 72; // 데이터 만료 시간
		
	 @Autowired
	 RedisTemplate<String, Object> redisTemplate;
	 
	private Connection conn = null;
	private PreparedStatement pstmt_1 = null;
	private PreparedStatement pstmt_2 = null;
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
	
	
	public boolean insertInput(String msg) {
		JSONParser parser = new JSONParser();
		JSONObject obj = new JSONObject();
		
		try {
			obj = (JSONObject) parser.parse(msg);
		} catch (ParseException e1) {
			e1.printStackTrace();
			return false;
		}
		
		String sql = "INSERT INTO userdata (pID, output, demand, storage) VALUES (?,?,?,?)";
		try {
			// Redis
			ListOperations<String, Object> values = redisTemplate.opsForList();

			values.leftPush("prosumer:"+(String) obj.get("pID")+":output", (Double) obj.get("output"));
			values.leftPush("prosumer:"+(String) obj.get("pID")+":demand", (Double) obj.get("demand"));
			values.leftPush("prosumer:"+(String) obj.get("pID")+":user_storage", (Double) obj.get("storage"));
			
			//System.out.println(values.range("prosumer:"+(String) obj.get("pID")+":output", 0, -1).toString());
			
			// 6시간 이후 만료.
			if(values.size((String) obj.get("pID") +  ":output") >= MAX_SIZE ) {
				values.rightPop("prosumer:"+(String) obj.get("pID")+":output");
				values.rightPop("prosumer:"+(String) obj.get("pID")+":demand");
				values.rightPop("prosumer:"+(String) obj.get("pID")+":user_storage");
				//System.out.println(values.range("testOutput", 0, -1));
			}
			
			pstmt_1 = conn.prepareStatement(sql);
			pstmt_1.setString(1, (String) obj.get("pID"));
			pstmt_1.setDouble(2, (Double) obj.get("output"));
			pstmt_1.setDouble(3, (Double) obj.get("demand"));
			pstmt_1.setDouble(4, (Double) obj.get("storage"));
			pstmt_1.executeUpdate();
			
			pstmt_1.close();
			
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	
	public boolean insertOutput(String msg) {
		JSONParser parser = new JSONParser();
		JSONObject obj = new JSONObject();
		
		try {
			obj = (JSONObject) parser.parse(msg);
		} catch (ParseException e1) {
			e1.printStackTrace();
			return false;
		}
		
		String sql = "INSERT INTO controldata (pID, storage, sales, purchase_town, purchase_ex) VALUES (?,?,?,?,?)";
		try {
			
			//Redis
			ListOperations<String, Object> values = redisTemplate.opsForList();
			
			values.leftPush("prosumer:"+(String) obj.get("pID")+":sales", (Double) obj.get("sales"));
			values.leftPush("prosumer:"+(String) obj.get("pID")+":purchase_town", (Double) obj.get("purchase_town"));
			values.leftPush("prosumer:"+(String) obj.get("pID")+":purchase_ex", (Double) obj.get("purchase_ex"));
			values.leftPush("prosumer:"+(String) obj.get("pID")+":control_storage", (Double) obj.get("storage"));
			
			//System.out.println(values.range("testOutput", 0, -1));
			
			// 6시간 이후 만료.
			if(values.size((String) obj.get("pID") +  ":output") >= MAX_SIZE ) {
				values.rightPop("prosumer:"+(String) obj.get("pID")+":sales");
				values.rightPop("prosumer:"+(String) obj.get("pID")+":purchase_town");
				values.rightPop("prosumer:"+(String) obj.get("pID")+":purchase_ex");
				values.rightPop("prosumer:"+(String) obj.get("pID")+":control_storage");
				//System.out.println(values.range("testOutput", 0, -1));
				
			}
			
			pstmt_2 = conn.prepareStatement(sql);
			
			pstmt_2.setString(1, (String) obj.get("pID"));
			pstmt_2.setDouble(2, (Double) obj.get("storage"));
			pstmt_2.setDouble(3, (Double) obj.get("sales"));
			pstmt_2.setDouble(4, (Double) obj.get("purchase_town"));
			pstmt_2.setDouble(5, (Double) obj.get("purchase_ex"));
			pstmt_2.executeUpdate();
			
			pstmt_2.close();
			
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
}
