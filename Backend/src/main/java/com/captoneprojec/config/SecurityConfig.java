package com.captoneprojec.config;

import com.captoneprojec.jwt.CustomUserDetailsService;
import com.captoneprojec.jwt.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/user/register", "/user/login", "/passenger/add",
                                "/routes", "/passenger/id/**", "/busbookinginfo", "/bus", "/bookinginfo").permitAll()
                        .requestMatchers("/passengerbookingInfo",
                                "/busbookinginfo/add", "/passengerbookingInfo/add",
                                "/busbookinginfo/add/all", "/passengerbookingInfo/add/all","/passenger/update/**").hasAnyAuthority("ROLE_PASSENGER", "ROLE_ADMIN")
                        .requestMatchers("/bookinginfo/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/busbookinginfo/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/bus/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/passengerbookingInfo/x**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/routes/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/passenger/**").hasAuthority("ROLE_ADMIN")
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebMvcConfigurer corsController() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }


}
