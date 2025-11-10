package br.org.cesjo.sgi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@SpringBootApplication
public class SgiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SgiApplication.class, args);
	}

	@GetMapping("/")
	public String getMethodName() {
		return "Hello WOrld";
	}
	

}
