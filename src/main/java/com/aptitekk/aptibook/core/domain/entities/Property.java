/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;


import com.aptitekk.aptibook.ApplicationContextProvider;
import com.aptitekk.aptibook.core.domain.entities.propertyValidators.BooleanPropertyValidator;
import com.aptitekk.aptibook.core.domain.entities.propertyValidators.MaxLengthPropertyValidator;
import com.aptitekk.aptibook.core.domain.entities.propertyValidators.PropertyValidator;
import com.aptitekk.aptibook.core.util.EqualsHelper;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.context.ApplicationContext;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Property extends MultiTenantEntity implements Serializable {

    public enum Group {

        PERSONALIZATION(null),
        REGISTRATION(null),
        GOOGLE_SIGN_IN(null);

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

        GOOGLE_SIGN_IN_ENABLED("false", Group.GOOGLE_SIGN_IN, new BooleanPropertyValidator()),
        GOOGLE_SIGN_IN_WHITELIST("gmail.com, example.org", Group.GOOGLE_SIGN_IN, new MaxLengthPropertyValidator(256));

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

    @Id
    @GeneratedValue
    public Long id;

    @JsonIgnore
    @Enumerated(EnumType.STRING)
    public Key propertyKey;

    public String getKeyName() {
        return this.propertyKey.name();
    }

    public String propertyValue;

    public String getDefaultValue() {
        return this.propertyKey.getDefaultValue();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Property)) return false;

        Property other = (Property) o;

        return EqualsHelper.areEquals(propertyKey, other.propertyKey)
                && EqualsHelper.areEquals(propertyValue, other.propertyValue);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(propertyKey, propertyValue);
    }
}
