package ecom_blog.config;

import ecom_blog.dto.UserDto;
import ecom_blog.model.Role;
import ecom_blog.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;

    public DataInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gsd-moving.com";

        if (userService.findByEmail(adminEmail) == null) {
            log.info("Creating admin account: {}", adminEmail);
            UserDto adminDto = UserDto.builder()
                    .email(adminEmail)
                    .nom("Admin GSD")
                    .password("graceservicedd2026")
                    .role(Role.ROLE_ADMIN)
                    .build();

            userService.saveUser(adminDto);
            log.info("Admin account created successfully.");
        } else {
            log.info("Admin account already exists: {}", adminEmail);
        }
    }
}
