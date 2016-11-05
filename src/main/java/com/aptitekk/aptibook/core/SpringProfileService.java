/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class SpringProfileService {

    @Value("${spring.profiles.active:production}")
    private String activeProfilesString;

    private List<Profile> activeProfiles;

    public enum Profile {
        PRODUCTION("production"),
        DEV("dev");

        private String profileName;

        Profile(String profileName) {
            this.profileName = profileName;
        }

        public String getProfileName() {
            return this.profileName;
        }

        public static Profile getProfileByName(String name) {
            for (Profile profile : values()) {
                if (profile.profileName.equals(name))
                    return profile;
            }
            return null;
        }
    }

    @PostConstruct
    private void init() {
        String[] springProfilesSplit = activeProfilesString.split(" ");
        activeProfiles = new ArrayList<>();

        for (String profileName : springProfilesSplit) {
            Profile profile = Profile.getProfileByName(profileName);
            if (profile != null)
                activeProfiles.add(profile);
        }
    }

    public boolean isProfileActive(Profile profile) {
        return profile != null && activeProfiles.contains(profile);
    }

}
