/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class TenantFilter implements Filter {

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
                if(pathSplit[1].equals("index.html"))
                {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                //API
                if(pathSplit[1].equals("api")) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                //Resources
                if (pathSplit[1].matches("packed|images|favicons|error")) {
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

                //API (Including Tenant)
                if(pathSplit.length > 2 && pathSplit[2].equals("api")) {
                    String url = path.substring(path.indexOf("/", 2));
                    if (url.contains(";"))
                        url = url.substring(0, url.indexOf(";"));
                    httpServletRequest.getRequestDispatcher(url).forward(servletRequest, servletResponse);
                    return;
                }

                httpServletRequest.getRequestDispatcher("/index.html").forward(servletRequest, servletResponse);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void destroy() {
    }
}
