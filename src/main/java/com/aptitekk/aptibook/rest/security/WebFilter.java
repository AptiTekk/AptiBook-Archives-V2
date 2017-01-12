/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.security;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

@Component
public class WebFilter implements Filter {

    private TenantManagementService tenantManagementService;
    private TenantRepository tenantRepository;
    private final LogService logService;

    @Autowired
    public WebFilter(TenantManagementService tenantManagementService, TenantRepository tenantRepository, LogService logService) {
        this.tenantManagementService = tenantManagementService;
        this.tenantRepository = tenantRepository;
        this.logService = logService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.logService.logInfo(getClass(), "Initialized");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        try {
            HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
            HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;

            String path = httpServletRequest.getRequestURI().substring(httpServletRequest.getContextPath().length()).replaceAll("//", "/");
            String[] pathSplit = path.split("/");

            if (pathSplit.length >= 2) {
                boolean beenFiltered = httpServletRequest.getAttribute("filtered") != null;
                boolean cameFromTenant = httpServletRequest.getAttribute("tenant") != null;

                //Resources
                if (pathSplit[1].matches("packed|static|favicon.ico")) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                //Root RestControllers
                if (pathSplit[1].matches("error|ping|oauth")) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                //Index (Angular)
                if (pathSplit[1].equals("index.html") && beenFiltered) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                //API
                if (pathSplit[1].equals("api") && beenFiltered && cameFromTenant) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                httpServletRequest.setAttribute("filtered", true);

                //Tenants
                if (tenantManagementService.getAllowedTenantSlugs().contains(pathSplit[1].toLowerCase())) { //Valid Tenant ID
                    String tenantSlug = pathSplit[1].toLowerCase();
                    Tenant tenant = tenantRepository.findTenantBySlug(tenantSlug);
                    httpServletRequest.setAttribute("tenant", tenant);

                    String url;
                    if (pathSplit.length > 2 && pathSplit[2].equals("api")) {
                        url = path.substring(path.indexOf("/", 2));
                        if (url.contains(";"))
                            url = url.substring(0, url.indexOf(";"));
                    } else
                        url = "/index.html";

                    httpServletRequest.getRequestDispatcher(url).forward(servletRequest, servletResponse);
                    return;
                }
            }

            notFound(httpServletRequest, httpServletResponse);
        } catch (Exception e) {
            logService.logException(getClass(), e, "Unhandled Exception");
        }
    }

    private void notFound(HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(404);
    }

    @Override
    public void destroy() {
        this.logService.logInfo(getClass(), "Destroyed");
    }
}
