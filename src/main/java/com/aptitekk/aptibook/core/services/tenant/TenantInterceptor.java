/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.tenant;

import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Component
public class TenantInterceptor extends HandlerInterceptorAdapter {

    private final TenantRepository tenantRepository;
    private final TenantManagementService tenantManagementService;

    @Autowired
    public TenantInterceptor(TenantRepository tenantRepository,
                             TenantManagementService tenantManagementService) {
        this.tenantRepository = tenantRepository;
        this.tenantManagementService = tenantManagementService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        @SuppressWarnings("unchecked")
        Map<String, String> mappingVars = (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);

        if (mappingVars != null) {
            String tenantSlug = mappingVars.get("tenant");

            if (tenantSlug != null)
                if (tenantManagementService.getAllowedTenantSlugs().contains(tenantSlug))
                    request.setAttribute("tenant", tenantRepository.findTenantBySlug(tenantSlug));
        }

        return super.preHandle(request, response, handler);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        super.postHandle(request, response, handler, modelAndView);
    }
}
