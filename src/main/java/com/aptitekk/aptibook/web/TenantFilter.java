/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web;

import com.aptitekk.aptibook.core.logging.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class TenantFilter implements Filter {

    private final LogService logService;

    @Autowired
    public TenantFilter(LogService logService) {
        this.logService = logService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        try {
            HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
            HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;

            String path = httpServletRequest.getRequestURI().substring(httpServletRequest.getContextPath().length());
            String[] pathSplit = httpServletRequest.getRequestURI().substring(httpServletRequest.getContextPath().length()).split("/");

            if (pathSplit.length >= 2) {

                //Index (Angular)
                if (pathSplit[1].equals("index.html")) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                //API
                if (pathSplit[1].equals("api")) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                //Resources
                if (pathSplit[1].matches("packed|splashscreen|favicons|error")) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                List<String> allowedTenantSlugs = new ArrayList<>();
                allowedTenantSlugs.add("dev");

                //Tenants
                if (allowedTenantSlugs.contains(pathSplit[1].toLowerCase())) { //Valid Tenant ID
                    String tenantSlug = pathSplit[1].toLowerCase();
                    httpServletRequest.setAttribute("tenant", tenantSlug);
                }

                String url;
                if (pathSplit.length > 2) {
                    url = path.substring(path.indexOf("/", 2));
                    if (url.contains(";"))
                        url = url.substring(0, url.indexOf(";"));
                } else
                    url = "index.html";

                httpServletRequest.getRequestDispatcher(url).forward(servletRequest, servletResponse);
            }
        } catch (Exception e) {
            logService.logException(getClass(), e, "Unhandled Exception");
        }
    }

    @Override
    public void destroy() {
    }
}
