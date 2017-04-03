/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final RESTAuthenticationEntryPoint authenticationEntryPoint;

    private final RESTAuthenticationSuccessHandler authenticationSuccessHandler;

    private final RESTAuthenticationFailureHandler authenticationFailureHandler;

    @Autowired
    public SecurityConfiguration(RESTAuthenticationEntryPoint authenticationEntryPoint, RESTAuthenticationSuccessHandler authenticationSuccessHandler, RESTAuthenticationFailureHandler authenticationFailureHandler) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.authenticationSuccessHandler = authenticationSuccessHandler;
        this.authenticationFailureHandler = authenticationFailureHandler;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("user").password("user").roles("USER")
                .and().withUser("admin").password("admin").roles("ADMIN");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // Define the endpoints for which users must be authenticated.
                .authorizeRequests()
                //.antMatchers("/api/*/auth/sign-in").permitAll() // Everyone can access the sign in endpoint.
                .antMatchers(HttpMethod.GET, "/api/*/oauthUrl/*").permitAll() // Everyone can access the OAuth URL generators
                .antMatchers(HttpMethod.GET, "/api/*/tenant").permitAll() // Everyone can access the basic tenant details
                .antMatchers("/api/**").authenticated() // All other endpoints must be authenticated.
                .anyRequest().permitAll() // Permit anything outside of the api endpoints.
                .and()

                // Disable CSRF (Cross Site Request Forgery) for now.
                .csrf()
                .disable() //TODO: Look into CSRF

                // Define behavior when an unauthenticated user accesses a secured endpoint.
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint)
                .and()

                // Configure the login page behavior
                .formLogin()
                .successHandler(authenticationSuccessHandler)
                .failureHandler(authenticationFailureHandler);
    }
}
