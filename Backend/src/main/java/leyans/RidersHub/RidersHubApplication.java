package leyans.RidersHub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RidersHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(RidersHubApplication.class, args);

	}




}
