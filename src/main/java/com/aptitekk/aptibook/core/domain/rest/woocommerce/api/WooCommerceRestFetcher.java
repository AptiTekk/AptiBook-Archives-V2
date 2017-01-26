/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.woocommerce.api;

import com.aptitekk.aptibook.core.domain.rest.woocommerce.api.subscriptions.Subscription;
import com.aptitekk.aptibook.core.domain.rest.woocommerce.api.subscriptions.Subscriptions;
import com.aptitekk.aptibook.core.services.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class WooCommerceRestFetcher {

    private static final String WOOCOMMERCE_URL = System.getenv("WOOCOMMERCE_URL");
    private static final String WOOCOMMERCE_CK = System.getenv("WOOCOMMERCE_CK");
    private static final String WOOCOMMERCE_CS = System.getenv("WOOCOMMERCE_CS");

    public static boolean isReady() {
        return WOOCOMMERCE_URL != null && !WOOCOMMERCE_URL.isEmpty()
                && WOOCOMMERCE_CK != null && !WOOCOMMERCE_CK.isEmpty()
                && WOOCOMMERCE_CS != null && !WOOCOMMERCE_CS.isEmpty();
    }

    private LogService logService;

    @Autowired
    public WooCommerceRestFetcher(LogService logService) {
        this.logService = logService;
    }

    private <T> T fetchResponse(String endpoint, Class<T> clazz) {
        RestTemplate restTemplate = new RestTemplate();
        UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(WOOCOMMERCE_URL + endpoint)
                .queryParam("consumer_key", WOOCOMMERCE_CK)
                .queryParam("consumer_secret", WOOCOMMERCE_CS)
                .queryParam("filter[limit]", -1)
                .build();
        try {
            return restTemplate.getForObject(uriComponents.toUri(), clazz);
        } catch (HttpClientErrorException e) {
            logService.logException(getClass(), e, "Unable to fetch from WooCommerce");
        } catch (HttpServerErrorException e) {
            logService.logError(getClass(), "Could not fetch from AptiTekk: " + e.getMessage());
        } catch (ResourceAccessException | UnknownHttpStatusCodeException e) {
            logService.logError(getClass(), "Could not connect to AptiTekk: " + e.getMessage());
        } catch (HttpMessageNotReadableException e) {
            logService.logError(getClass(), "Could not read response from AptiTekk: " + e.getMessage());
        }
        return null;
    }

    public List<Subscription> getSubscriptions() {
        Subscriptions subscriptions = fetchResponse("subscriptions", Subscriptions.class);
        return subscriptions != null ? subscriptions.getSubscriptions() : null;
    }

}
