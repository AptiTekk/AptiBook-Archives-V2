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

                //Resources
                if (pathSplit[1].matches("scripts|styles|error|bootstrap-3.3.7-dist")) {
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }

                List<String> allowedTenantSlugs = new ArrayList<>();
                allowedTenantSlugs.add("test");
                allowedTenantSlugs.add("mitch");

                //Tenants
                if (allowedTenantSlugs.contains(pathSplit[1].toLowerCase())) { //Valid Tenant ID
                    String tenantSlug = pathSplit[1].toLowerCase();
                    httpServletRequest.setAttribute("tenant", tenantSlug);

                    String url = pathSplit.length >= 3 ? path.substring(path.indexOf("/", 2)) : "/";
                    if (url.contains(";"))
                        url = url.substring(0, url.indexOf(";"));

                    httpServletRequest.getRequestDispatcher(url).forward(servletRequest, servletResponse);
                    return;
                }
            }
            filterChain.doFilter(servletRequest, servletResponse);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void destroy() {
    }
}
