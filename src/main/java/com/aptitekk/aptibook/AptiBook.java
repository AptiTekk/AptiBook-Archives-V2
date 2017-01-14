/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook;

import com.aptitekk.aptibook.core.services.tenant.TenantInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@EnableAsync
@EnableScheduling
@SpringBootApplication
@ComponentScan("com.aptitekk.aptibook")
@EntityScan("com.aptitekk.aptibook")
public class AptiBook {

    public static void main(String... args) {
        SpringApplication.run(AptiBook.class, args);
    }

    @Configuration
    public static class AptiBookConfiguration extends WebMvcConfigurerAdapter {

        final TenantInterceptor tenantInterceptor;

        @Autowired
        public AptiBookConfiguration(TenantInterceptor tenantInterceptor) {
            this.tenantInterceptor = tenantInterceptor;
        }

        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            registry.addInterceptor(tenantInterceptor);
        }
    }

}
