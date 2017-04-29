/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities.enums.property;

import com.aptitekk.aptibook.ApplicationContextProvider;
import com.aptitekk.aptibook.core.domain.entities.enums.property.validators.AuthenticationMethodPropertyValidator;
import com.aptitekk.aptibook.core.domain.entities.enums.property.validators.BooleanPropertyValidator;
import com.aptitekk.aptibook.core.domain.entities.enums.property.validators.MaxLengthPropertyValidator;
import com.aptitekk.aptibook.core.domain.entities.enums.property.validators.PropertyValidator;
import org.springframework.context.ApplicationContext;

import java.util.ArrayList;
import java.util.List;

public class Property {

    public enum Group {
        PERSONALIZATION(null),
        REGISTRATION(null),
        GOOGLE_SIGN_IN(null),
        CAS_AUTHENTICATION(null);

        private Class<? extends ChangeListener> propertyGroupChangeListenerClass;

        Group(Class<? extends ChangeListener> propertyGroupChangeListenerClass) {
            this.propertyGroupChangeListenerClass = propertyGroupChangeListenerClass;
        }

        public List<Key> getKeys() {
            Key[] allKeys = Key.values();
            List<Key> groupKeys = new ArrayList<>();
            for (Key key : allKeys) {
                if (key.getGroup().equals(this))
                    groupKeys.add(key);
            }

            return groupKeys;
        }

        public void firePropertiesChangedEvent() {
            if (propertyGroupChangeListenerClass != null) {
                ApplicationContext applicationContext = ApplicationContextProvider.getApplicationContext();
                ChangeListener bean = applicationContext.getBean(propertyGroupChangeListenerClass);
                bean.onPropertiesChanged(this);
            }
        }

        public interface ChangeListener {
            void onPropertiesChanged(Group propertyGroup);
        }
    }

    public enum Key {
        PERSONALIZATION_ORGANIZATION_NAME(null, Group.PERSONALIZATION, new MaxLengthPropertyValidator(64)),

        REGISTRATION_ENABLED("true", Group.REGISTRATION, new BooleanPropertyValidator()),

        AUTHENTICATION_METHOD(AuthenticationMethod.BUILT_IN.name(), null, new AuthenticationMethodPropertyValidator()),

        GOOGLE_SIGN_IN_ENABLED("false", Group.GOOGLE_SIGN_IN, new BooleanPropertyValidator()),
        GOOGLE_SIGN_IN_WHITELIST("", Group.GOOGLE_SIGN_IN, new MaxLengthPropertyValidator(256)),

        CAS_SERVER_PATH("", Group.CAS_AUTHENTICATION, new MaxLengthPropertyValidator(256));

        private final String defaultValue;
        private final Group group;
        private PropertyValidator propertyValidator;

        Key(String defaultValue, Group group, PropertyValidator propertyValidator) {
            this.defaultValue = defaultValue;
            this.group = group;
            this.propertyValidator = propertyValidator;
        }

        public String getDefaultValue() {
            return defaultValue;
        }

        public Group getGroup() {
            return group;
        }

        public PropertyValidator getPropertyValidator() {
            return propertyValidator;
        }
    }

}
