package leyans.RidersHub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories()
public class RidersHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(RidersHubApplication.class, args);
	}


}
