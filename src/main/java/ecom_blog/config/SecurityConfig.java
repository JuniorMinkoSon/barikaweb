package ecom_blog.config;

import ecom_blog.security.CustomLoginSuccessHandler;
import ecom_blog.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

@Configuration
public class SecurityConfig {

        private final CustomLoginSuccessHandler successHandler;

        public SecurityConfig(CustomLoginSuccessHandler successHandler) {
                this.successHandler = successHandler;
        }

        @Bean
        public HttpFirewall allowDoubleSlashFirewall() {
                StrictHttpFirewall firewall = new StrictHttpFirewall();
                firewall.setAllowUrlEncodedDoubleSlash(true);
                firewall.setAllowSemicolon(true);
                firewall.setAllowBackSlash(true);
                firewall.setAllowUrlEncodedSlash(true);
                return firewall;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        CustomUserDetailsService userDetailsService) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .userDetailsService(userDetailsService)
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/", "/index", "/index.html",
                                                                "/register", "/login", "/error", "/change-password",
                                                                "/blog/**", "/projets", "/services", "/objectifs",
                                                                "/propos", "/contact",
                                                                "/tourisme-categories", "/sejours",
                                                                "/reservation/secteurs", "/reservation/voitures",
                                                                "/reservation/loisirs", "/reservation/alimentaire",
                                                                "/reservation/evenementiel",
                                                                "/reservation/fournisseur/**",
                                                                "/reservation/service/**", "/reservation/recherche",
                                                                "/universal-search",
                                                                "/css/**", "/js/**", "/images/**", "/uploads/**")
                                                .permitAll()
                                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/fournisseur/**").hasRole("FOURNISSEUR")
                                                .requestMatchers("/acteur/touriste").hasRole("USER")
                                                .requestMatchers("/acteur/guide").hasRole("GUIDE")
                                                .requestMatchers("/acteur/artisan").hasRole("ARTISAN")
                                                .requestMatchers("/acteur/organisateur").hasRole("ORGANISATEUR")
                                                .requestMatchers("/acteur/ministere").hasAnyRole("MINISTERE", "ADMIN")
                                                .requestMatchers("/acteur/workflows/**").hasAnyRole(
                                                                "USER", "GUIDE", "ARTISAN", "ORGANISATEUR",
                                                                "MINISTERE", "ADMIN")
                                                .requestMatchers("/reservation/reserver",
                                                                "/reservation/mes-reservations",
                                                                "/reservation/confirmation/**",
                                                                "/evaluation/**")
                                                .hasAnyRole("USER", "ADMIN")
                                                .requestMatchers("/user/**").hasRole("USER")
                                                .anyRequest().authenticated())
                                .formLogin(login -> login
                                                .loginPage("/login")
                                                .loginProcessingUrl("/login")
                                                .usernameParameter("email")
                                                .passwordParameter("password")
                                                .successHandler(successHandler)
                                                .failureUrl("/login?error"))
                                .logout(logout -> logout
                                                .logoutUrl("/logout")
                                                .logoutSuccessUrl("/login?logout"));

                return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}
