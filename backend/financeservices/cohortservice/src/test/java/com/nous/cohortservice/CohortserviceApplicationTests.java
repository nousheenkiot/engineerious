package com.nous.cohortservice;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CohortserviceApplicationTests {

	@Test
	void contextLoads() {

        assertThat("Alice".equals("Alice"));

	}

}
