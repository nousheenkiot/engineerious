package com.nous.authservice.config;

import com.nous.authservice.model.Activity;
import com.nous.authservice.model.Role;
import com.nous.authservice.model.User;
import com.nous.authservice.repository.ActivityRepository;
import com.nous.authservice.repository.RoleRepository;
import com.nous.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    @Transactional
    public CommandLineRunner initData(
            UserRepository userRepository,
            RoleRepository roleRepository,
            ActivityRepository activityRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (roleRepository.count() == 0) {
                // Activities
                Activity cohortView = createActivityIfNotFound(activityRepository, "COHORT_VIEW");
                Activity cohortCreate = createActivityIfNotFound(activityRepository, "COHORT_CREATE");
                Activity cohortUpdate = createActivityIfNotFound(activityRepository, "COHORT_UPDATE");
                Activity cohortDelete = createActivityIfNotFound(activityRepository, "COHORT_DELETE");
                Activity cohortPagination = createActivityIfNotFound(activityRepository, "COHORT_PAGINATION");
                Activity cashflowView = createActivityIfNotFound(activityRepository, "CASHFLOW_VIEW");
                Activity cashflowCreate = createActivityIfNotFound(activityRepository, "CASHFLOW_CREATE");
                Activity cashflowUpdate = createActivityIfNotFound(activityRepository, "CASHFLOW_UPDATE");
                Activity cashflowPagination = createActivityIfNotFound(activityRepository, "CASHFLOW_PAGINATION");
                Activity processingRun = createActivityIfNotFound(activityRepository, "PROCESSING_RUN");
                Activity adminAccess = createActivityIfNotFound(activityRepository, "ADMIN_ACCESS");

                // Roles
                Role adminRole = createRoleIfNotFound(roleRepository, "ROLE_ADMIN", 
                        new HashSet<>(Arrays.asList(cohortView, cohortCreate, cohortUpdate, cohortDelete, cohortPagination,
                                cashflowView, cashflowCreate, cashflowUpdate, cashflowPagination, processingRun, adminAccess)));
                
                Role userRole = createRoleIfNotFound(roleRepository, "ROLE_USER",
                        new HashSet<>(Arrays.asList(cohortView, cohortPagination, cashflowView, cashflowPagination)));

                // Users
                createUserIfNotFound(userRepository, "admin", "admin", new HashSet<>(Arrays.asList(adminRole)), passwordEncoder);
                createUserIfNotFound(userRepository, "user", "test", new HashSet<>(Arrays.asList(userRole)), passwordEncoder);
            }
        };
    }

    private Activity createActivityIfNotFound(ActivityRepository activityRepository, String name) {
        return activityRepository.findByName(name).orElseGet(() -> activityRepository.save(new Activity(name)));
    }

    private Role createRoleIfNotFound(RoleRepository roleRepository, String name, Set<Activity> activities) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role role = new Role(name);
            role.setActivities(activities);
            return roleRepository.save(role);
        });
    }

    private void createUserIfNotFound(UserRepository userRepository, String username, String password, Set<Role> roles, PasswordEncoder passwordEncoder) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRoles(roles);
            userRepository.save(user);
        }
    }
}
