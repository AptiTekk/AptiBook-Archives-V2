--
-- Data for Name: tenant; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO tenant (id, domain, stripesubscriptionid, stripeplan, stripestatus) VALUES (20000, 'junit', 'junit', 'PLATINUM', 'ACTIVE');

--
-- Data for Name: file; Type: TABLE DATA; Schema: public; Owner: aptibook
--

--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO "user" (id, admin, emailaddress, firstname, hashedpassword, lastname, phonenumber, verificationcode, verified, tenant_id) VALUES (20100, true, NULL, NULL, 'sha1:64000:18:EWBWPv0POW6Y/idPNSqGRGei5IrsjQEo:ZaDEoB+GmH1qiQTykMmHuvNE', NULL, NULL, NULL, true, 20000);
INSERT INTO "user" (id, admin, emailaddress, firstname, hashedpassword, lastname, phonenumber, verificationcode, verified, tenant_id) VALUES (20101, false, 'admin@aptitekk.com', 'Jill', 'sha1:64000:18:0CEV3+Y9ZOyTw7Az7qFRwAYQcNA9FU0a:lKBIK0mA9INq3oBa5GbGm/pm', 'Administrator', NULL, NULL, true, 20000);
INSERT INTO "user" (id, admin, emailaddress, firstname, hashedpassword, lastname, phonenumber, verificationcode, verified, tenant_id) VALUES (20102, false, 'teacher@aptitekk.com', 'John', 'sha1:64000:18:JVorXJZvsVt1QqaklJV+288mOISorajN:GzW+E13xzmNlz27oUKYKJDVK', 'Teacher', NULL, NULL, true, 20000);
INSERT INTO "user" (id, admin, emailaddress, firstname, hashedpassword, lastname, phonenumber, verificationcode, verified, tenant_id) VALUES (20103, false, 'librarian@aptitekk.com', 'Julia', 'sha1:64000:18:4QcTGJym6dWyin+R0nu6gI+yYqV5xUEd:lfTEmIIDnccVoSU/voNBBoqc', 'Librarian', NULL, NULL, true, 20000);


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO notification (id, body, creation, notif_read, subject, tenant_id, user_id) VALUES (20420, 'Lorem ipsum', '2017-02-21 09:07:53.864', false, 'Test Notification', 20000, 20102);

--
--
-- Data for Name: resourcecategory; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO resourcecategory (id, name, tenant_id) VALUES (20300, 'Rooms', 20000);
INSERT INTO resourcecategory (id, name, tenant_id) VALUES (20301, 'Equipment', 20000);


--
-- Data for Name: usergroup; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO usergroup (id, name, tenant_id, parent_id) VALUES (20150, 'root', 20000, NULL);
INSERT INTO usergroup (id, name, tenant_id, parent_id) VALUES (20151, 'Administrators', 20000, 20150);
INSERT INTO usergroup (id, name, tenant_id, parent_id) VALUES (20152, 'Librarians', 20000, 20151);
INSERT INTO usergroup (id, name, tenant_id, parent_id) VALUES (20153, 'Teachers', 20000, 20152);


--
-- Data for Name: resource; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO resource (id, name, needsapproval, tenant_id, image_id, owner_id, resourcecategory_id) VALUES (20320, 'Library', true, 20000, NULL, 20152, 20300);
INSERT INTO resource (id, name, needsapproval, tenant_id, image_id, owner_id, resourcecategory_id) VALUES (20321, 'Cart 1', true, 20000, NULL, 20151, 20301);
INSERT INTO resource (id, name, needsapproval, tenant_id, image_id, owner_id, resourcecategory_id) VALUES (20322, 'Cart 2', true, 20000, NULL, 20151, 20301);
INSERT INTO resource (id, name, needsapproval, tenant_id, image_id, owner_id, resourcecategory_id) VALUES (20323, 'Teacher Laptop', true, 20000, NULL, 20153, 20301);


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO reservation (id, datecreated, "end", start, status, title, tenant_id, resource_id, user_id) VALUES (20350, '2017-02-21 09:07:53.652', '2017-02-28 22:00:00.653', '2017-02-25 15:30:00.653', 'APPROVED', 'Book Fair', 20000, 20320, 20102);
INSERT INTO reservation (id, datecreated, "end", start, status, title, tenant_id, resource_id, user_id) VALUES (20351, '2017-02-21 09:07:53.688', '2017-02-10 22:30:00.688', '2017-02-10 19:00:00.688', 'REJECTED', 'Essay Research', 20000, 20320, 20102);
INSERT INTO reservation (id, datecreated, "end", start, status, title, tenant_id, resource_id, user_id) VALUES (20352, '2017-02-21 09:07:53.708', '2017-02-07 22:00:00.709', '2017-02-06 19:33:00.708', 'APPROVED', 'Test', 20000, 20320, 20102);
INSERT INTO reservation (id, datecreated, "end", start, status, title, tenant_id, resource_id, user_id) VALUES (20353, '2017-02-21 09:07:53.728', '2017-02-06 23:45:00.728', '2017-02-05 20:30:00.728', 'APPROVED', 'Sage Testing', 20000, 20321, 20102);


--
-- Data for Name: reservationdecision; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO reservationdecision (id, approved, comment, tenant_id, reservation_id, user_id, usergroup_id) VALUES (20380, false, NULL, 20000, 20350, 20103, 20152);
INSERT INTO reservationdecision (id, approved, comment, tenant_id, reservation_id, user_id, usergroup_id) VALUES (20381, true, NULL, 20000, 20350, 20101, 20151);
INSERT INTO reservationdecision (id, approved, comment, tenant_id, reservation_id, user_id, usergroup_id) VALUES (20382, false, NULL, 20000, 20351, 20101, 20151);
INSERT INTO reservationdecision (id, approved, comment, tenant_id, reservation_id, user_id, usergroup_id) VALUES (20383, true, NULL, 20000, 20352, 20101, 20151);
INSERT INTO reservationdecision (id, approved, comment, tenant_id, reservation_id, user_id, usergroup_id) VALUES (20384, true, NULL, 20000, 20353, 20101, 20151);

--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO tag (id, name, tenant_id, resourcecategory_id) VALUES (20400, 'adobe', 20000, 20301);
INSERT INTO tag (id, name, tenant_id, resourcecategory_id) VALUES (20401, 'office', 20000, 20301);
INSERT INTO tag (id, name, tenant_id, resourcecategory_id) VALUES (20402, 'chromebook', 20000, 20301);


--
-- Data for Name: resource_tag; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO resource_tag (resources_id, tags_id) VALUES (20321, 20400);
INSERT INTO resource_tag (resources_id, tags_id) VALUES (20321, 20401);
INSERT INTO resource_tag (resources_id, tags_id) VALUES (20321, 20402);
INSERT INTO resource_tag (resources_id, tags_id) VALUES (20322, 20401);


--
-- Data for Name: user_permission; Type: TABLE DATA; Schema: public; Owner: aptibook
--



--
-- Data for Name: user_usergroup; Type: TABLE DATA; Schema: public; Owner: aptibook
--

INSERT INTO user_usergroup (users_id, usergroups_id) VALUES (20100, 20150);
INSERT INTO user_usergroup (users_id, usergroups_id) VALUES (20101, 20151);
INSERT INTO user_usergroup (users_id, usergroups_id) VALUES (20102, 20153);
INSERT INTO user_usergroup (users_id, usergroups_id) VALUES (20103, 20152);


--
-- Data for Name: usergroup_permission; Type: TABLE DATA; Schema: public; Owner: aptibook
--


