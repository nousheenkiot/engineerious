package com.nous.cohortservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nous.cohortservice.entity.Policy;
import com.nous.cohortservice.repository.PolicyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
public class PolicyControllerTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void testCreatePolicy() throws Exception {
        // Arrange: Create a test policy
        Policy testPolicy = new Policy();
        testPolicy.setPolicyNumber("POL-2024-001");
        testPolicy.setHolderName("John Doe");
        testPolicy.setPremium(1500.00);

        // Act: Send POST request to create policy
        String response = mockMvc.perform(post("/api/policies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testPolicy)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.policyNumber").value("POL-2024-001"))
                .andExpect(jsonPath("$.holderName").value("John Doe"))
                .andExpect(jsonPath("$.premium").value(1500.00))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Parse the response to get the created policy ID
        Policy createdPolicy = objectMapper.readValue(response, Policy.class);

        // Assert: Verify the policy was persisted in the database
        Optional<Policy> savedPolicy = policyRepository.findById(createdPolicy.getId());
        assertThat(savedPolicy).isPresent();
        assertThat(savedPolicy.get().getPolicyNumber()).isEqualTo("POL-2024-001");
        assertThat(savedPolicy.get().getHolderName()).isEqualTo("John Doe");
        assertThat(savedPolicy.get().getPremium()).isEqualTo(1500.00);
    }

    @Test
    public void testGetPolicyById() throws Exception {
        // Arrange: Create and save a policy to the database
        Policy testPolicy = new Policy();
        testPolicy.setPolicyNumber("POL-2024-002");
        testPolicy.setHolderName("Jane Smith");
        testPolicy.setPremium(2500.00);
        Policy savedPolicy = policyRepository.save(testPolicy);

        // Act: Send GET request to retrieve the policy
        mockMvc.perform(get("/api/policies/{id}", savedPolicy.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedPolicy.getId()))
                .andExpect(jsonPath("$.policyNumber").value("POL-2024-002"))
                .andExpect(jsonPath("$.holderName").value("Jane Smith"))
                .andExpect(jsonPath("$.premium").value(2500.00));

        // Assert: Verify the policy still exists in the database
        Optional<Policy> retrievedPolicy = policyRepository.findById(savedPolicy.getId());
        assertThat(retrievedPolicy).isPresent();
    }

    @Test
    public void testDeletePolicy() throws Exception {
        // Arrange: Create and save a policy to the database
        Policy testPolicy = new Policy();
        testPolicy.setPolicyNumber("POL-2024-003");
        testPolicy.setHolderName("Bob Johnson");
        testPolicy.setPremium(3500.00);
        Policy savedPolicy = policyRepository.save(testPolicy);

        // Act: Send DELETE request to remove the policy
        mockMvc.perform(delete("/api/policies/{id}", savedPolicy.getId()))
                .andExpect(status().isOk());

        // Assert: Verify the policy was removed from the database
        Optional<Policy> deletedPolicy = policyRepository.findById(savedPolicy.getId());
        assertThat(deletedPolicy).isEmpty();
    }
}
