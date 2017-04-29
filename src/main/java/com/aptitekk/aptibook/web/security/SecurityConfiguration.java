/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.web.security.authenticationFilters.CustomBasicAuthenticationFilter;
import com.aptitekk.aptibook.web.security.cas.CASTicketFilter;
import com.aptitekk.aptibook.web.security.csrf.CSRFCookieFilter;
import com.aptitekk.aptibook.web.security.oauth.GoogleOAuthFilter;
import com.aptitekk.aptibook.web.security.tenant.TenantDiscoveryFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final APIAuthenticationEntryPoint apiAuthenticationEntryPoint;
    private final TenantDiscoveryFilter tenantDiscoveryFilter;
    private final CSRFCookieFilter csrfCookieFilter;
    private final CustomBasicAuthenticationFilter customBasicAuthenticationFilter;
    private final GoogleOAuthFilter googleOAuthFilter;
    private final CASTicketFilter casTicketFilter;

    @Autowired
    public SecurityConfiguration(APIAuthenticationEntryPoint apiAuthenticationEntryPoint,
                                 TenantDiscoveryFilter tenantDiscoveryFilter,
                                 CSRFCookieFilter csrfCookieFilter,
                                 CustomBasicAuthenticationFilter customBasicAuthenticationFilter,
                                 GoogleOAuthFilter googleOAuthFilter,
                                 CASTicketFilter casTicketFilter) {
        this.apiAuthenticationEntryPoint = apiAuthenticationEntryPoint;
        this.tenantDiscoveryFilter = tenantDiscoveryFilter;
        this.csrfCookieFilter = csrfCookieFilter;
        this.customBasicAuthenticationFilter = customBasicAuthenticationFilter;
        this.googleOAuthFilter = googleOAuthFilter;
        this.casTicketFilter = casTicketFilter;
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

                // Add the CAS Ticket Filter
                .addFilterBefore(casTicketFilter, BasicAuthenticationFilter.class)

                // Define the endpoints for which users must be authenticated.
                .authorizeRequests()

                // Everyone can access the basic Tenant details.
                .antMatchers(HttpMethod.GET, "/api/tenant").permitAll()
                .antMatchers(HttpMethod.GET, "/api/tenant/name").permitAll()

                // Everyone can register.
                .antMatchers(HttpMethod.POST, "/api/register").permitAll()

                // Everyone can verify registration.
                .antMatchers(HttpMethod.GET, "/api/register/verify").permitAll()

                // Everyone can access the list of allowed domains for registration
                .antMatchers(HttpMethod.GET, "/api/properties/allowedDomains").permitAll()

                // Everyone can access the OAuth endpoints.
                .antMatchers(HttpMethod.GET, "/api/oauth/*").permitAll()

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
