/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.web.security.authenticationFilters.CustomBasicAuthenticationFilter;
import com.aptitekk.aptibook.web.security.csrf.CSRFCookieFilter;
import com.aptitekk.aptibook.web.security.oauth.GoogleOAuthFilter;
import com.aptitekk.aptibook.web.security.tenant.TenantDiscoveryFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
@EnableOAuth2Client
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final APIAuthenticationEntryPoint apiAuthenticationEntryPoint;
    private final TenantDiscoveryFilter tenantDiscoveryFilter;
    private final CSRFCookieFilter csrfCookieFilter;
    private final CustomBasicAuthenticationFilter customBasicAuthenticationFilter;
    private final GoogleOAuthFilter googleOAuthFilter;

    @Autowired
    public SecurityConfiguration(APIAuthenticationEntryPoint apiAuthenticationEntryPoint,
                                 TenantDiscoveryFilter tenantDiscoveryFilter,
                                 CSRFCookieFilter csrfCookieFilter,
                                 CustomBasicAuthenticationFilter customBasicAuthenticationFilter,
                                 GoogleOAuthFilter googleOAuthFilter) {
        this.apiAuthenticationEntryPoint = apiAuthenticationEntryPoint;
        this.tenantDiscoveryFilter = tenantDiscoveryFilter;
        this.csrfCookieFilter = csrfCookieFilter;
        this.customBasicAuthenticationFilter = customBasicAuthenticationFilter;
        this.googleOAuthFilter = googleOAuthFilter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // Add the Tenant Discovery Filter
                .addFilterBefore(tenantDiscoveryFilter, SecurityContextPersistenceFilter.class)

                // Add the CSRF Cookie Filter
                .addFilterAfter(csrfCookieFilter, CsrfFilter.class)

                // Add the custom BasicAuthenticationFilter
                .addFilterAt(customBasicAuthenticationFilter, BasicAuthenticationFilter.class)

                // Add the Google OAuth Filter
                .addFilterBefore(googleOAuthFilter, BasicAuthenticationFilter.class)

                // Define the endpoints for which users must be authenticated.
                .authorizeRequests()

                // Everyone can access the OAuth Endpoints
                .antMatchers(HttpMethod.GET, "/api/oauth/*").permitAll()

                // Everyone can access the basic Tenant details
                .antMatchers(HttpMethod.GET, "/api/tenant").permitAll()

                // All other endpoints must be authenticated.
                .antMatchers("/api/**").authenticated()

                // Permit anything outside of the api endpoints.
                .anyRequest().permitAll()
                .and()

                // Enable the default Form Login authentication.
                .formLogin()
                .disable()

                // Disable the default logout endpoint, since we provide our own.
                .logout()
                .disable()

                // Enable HTTP Basic authentication
                .httpBasic()
                .and()

                // Enable CSRF (Cross Site Request Forgery).
                .csrf()
                .csrfTokenRepository(generateCSRFTokenRepository())
                .and()

                // Define behavior when an unauthenticated user accesses a secured endpoint.
                .exceptionHandling()
                .authenticationEntryPoint(apiAuthenticationEntryPoint);
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
