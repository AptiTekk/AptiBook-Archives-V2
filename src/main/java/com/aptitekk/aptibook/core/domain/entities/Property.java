/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;


import com.aptitekk.aptibook.ApplicationContextProvider;
import com.aptitekk.aptibook.core.util.EqualsHelper;
import org.springframework.context.ApplicationContext;
import sun.security.validator.ValidatorException;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Property extends MultiTenantEntity implements Serializable {

    public enum Group {

        PERSONALIZATION("Personalization", null),
        REGISTRATION("Registration", null),
        GOOGLE_SIGN_IN("Google Sign In", null),
        DATE_TIME("Date And Time", null);

        private String friendlyName;
        private Class<? extends ChangeListener> propertyGroupChangeListenerClass;

        Group(String friendlyName, Class<? extends ChangeListener> propertyGroupChangeListenerClass) {
            this.friendlyName = friendlyName;
            this.propertyGroupChangeListenerClass = propertyGroupChangeListenerClass;
        }

        public String getFriendlyName() {
            return friendlyName;
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

        PERSONALIZATION_ORGANIZATION_NAME(null, Group.PERSONALIZATION),

        REGISTRATION_ENABLED("true", Group.REGISTRATION),

        GOOGLE_SIGN_IN_ENABLED("false", Group.GOOGLE_SIGN_IN),
        GOOGLE_SIGN_IN_WHITELIST("gmail.com, example.com", Group.GOOGLE_SIGN_IN),

        DATE_TIME_TIMEZONE("America/Denver", Group.DATE_TIME);

        private final String defaultValue;
        private final Group group;

        Key(String defaultValue, Group group) {
            this.defaultValue = defaultValue;
            this.group = group;
        }

        public String getDefaultValue() {
            return defaultValue;
        }

        public Group getGroup() {
            return group;
        }
    }

    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private Key propertyKey;

    private String propertyValue;

    private static final long serialVersionUID = 1L;

    public Key getPropertyKey() {
        return this.propertyKey;
    }

    public void setPropertyKey(Key key) {
        this.propertyKey = key;
    }

    public String getPropertyValue() {
        return this.propertyValue;
    }

    public void setPropertyValue(String value) {
        this.propertyValue = value;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Property)) return false;

        Property other = (Property) o;

        return EqualsHelper.areEquals(getPropertyKey(), other.getPropertyKey())
                && EqualsHelper.areEquals(getPropertyValue(), other.getPropertyValue());
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(getPropertyKey(), getPropertyValue());
    }
}
