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
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final RESTAuthenticationEntryPoint authenticationEntryPoint;
    private final DatabaseAuthenticationProvider databaseAuthenticationProvider;
    private final TenantDiscoveryFilter tenantDiscoveryFilter;
    private final CSRFCookieFilter csrfCookieFilter;

    @Autowired
    public SecurityConfiguration(RESTAuthenticationEntryPoint authenticationEntryPoint,
                                 DatabaseAuthenticationProvider databaseAuthenticationProvider,
                                 TenantDiscoveryFilter tenantDiscoveryFilter,
                                 CSRFCookieFilter csrfCookieFilter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.databaseAuthenticationProvider = databaseAuthenticationProvider;
        this.tenantDiscoveryFilter = tenantDiscoveryFilter;
        this.csrfCookieFilter = csrfCookieFilter;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        // Authenticates using the database authentication provider. (Username and Password)
        auth.authenticationProvider(databaseAuthenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // Add the Tenant discovery filter
                .addFilterAfter(tenantDiscoveryFilter, SecurityContextPersistenceFilter.class)
                // Add the CSRF cookie filter
                .addFilterAfter(csrfCookieFilter, CsrfFilter.class)
                // Define the endpoints for which users must be authenticated.
                .authorizeRequests()
                //.antMatchers("/api/*/auth/sign-in").permitAll() // Everyone can access the sign in endpoint.
                .antMatchers(HttpMethod.GET, "/api/*/oauthUrl/*").permitAll() // Everyone can access the OAuth URL generators
                .antMatchers(HttpMethod.GET, "/api/*/tenant").permitAll() // Everyone can access the basic tenant details
                .antMatchers("/api/**").authenticated() // All other endpoints must be authenticated.
                .anyRequest().permitAll() // Permit anything outside of the api endpoints.
                .and()

                // Enable HTTP Basic authentication
                .httpBasic()
                .and()

                // Enable CSRF (Cross Site Request Forgery).
                .csrf()
                .csrfTokenRepository(generateCSRFTokenRepository())
                .and()

                // Define behavior when an unauthenticated user accesses a secured endpoint.
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint);
    }

    /**
     * Generates a CSRF Token Repository with a modified header to fit Angular (and other framework) conventions.
     *
     * @return The CSRF Token Repository.
     */
    private CsrfTokenRepository generateCSRFTokenRepository() {
        HttpSessionCsrfTokenRepository tokenRepository = new HttpSessionCsrfTokenRepository();
        tokenRepository.setHeaderName("X-XSRF-TOKEN");
        return tokenRepository;
    }
}
