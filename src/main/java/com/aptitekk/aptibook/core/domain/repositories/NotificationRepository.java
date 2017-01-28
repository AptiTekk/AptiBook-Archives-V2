/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.Notification;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.PersistenceException;
import java.util.List;

@EntityRepository
public class NotificationRepository extends MultiTenantEntityRepositoryAbstract<Notification> {

    public void markAllAsReadForUser(User user) {
        try {
            entityManager
                    .createQuery("UPDATE Notification n SET n.notif_read = true WHERE n.user = ?1")
                    .setParameter(1, user)
                    .executeUpdate();
        } catch (PersistenceException ignored) {
        }
    }

    public List<Notification> getAllForUser(User user) {
        if (user == null)
            return null;

        try {
            return entityManager
                    .createQuery("SELECT n FROM Notification n WHERE n.user = :user ORDER BY n.creation", Notification.class)
                    .setParameter("user", user)
                    .getResultList();
        } catch (PersistenceException e) {
            return null;
        }
    }

}
