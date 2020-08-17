package vaninside.smartelecsystem.datamanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.redis.core.StringRedisTemplate;

@EnableCaching
@SpringBootApplication
public class DataManagerApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(DataManagerApplication.class, args);
	}	
}
