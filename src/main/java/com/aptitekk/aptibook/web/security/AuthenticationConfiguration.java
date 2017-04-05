/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.web.security.tenant.TenantMapAuthenticationTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;

@Configuration
public class AuthenticationConfiguration extends GlobalAuthenticationConfigurerAdapter {

    private final DatabaseAuthenticationProvider databaseAuthenticationProvider;
    private final TenantMapAuthenticationTokenProvider tenantMapAuthenticationTokenProvider;

    @Autowired
    public AuthenticationConfiguration(DatabaseAuthenticationProvider databaseAuthenticationProvider,
                                       TenantMapAuthenticationTokenProvider tenantMapAuthenticationTokenProvider) {
        this.databaseAuthenticationProvider = databaseAuthenticationProvider;
        this.tenantMapAuthenticationTokenProvider = tenantMapAuthenticationTokenProvider;
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                // Authenticates using the database authentication provider. (Username and Password)
                .authenticationProvider(databaseAuthenticationProvider)
                // Takes care of the TenantMapAuthenticationTokens who were set to authenticated = false by the TenantAuthenticationFilter.
                .authenticationProvider(tenantMapAuthenticationTokenProvider);
    }
}
