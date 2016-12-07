--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: file; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE file (
  id BIGINT NOT NULL,
  data bytea,
  tenant_id BIGINT NOT NULL
);

--
-- Name: hibernate_sequence; Type: SEQUENCE; Schema: public; 
--

DROP SEQUENCE IF EXISTS hibernate_sequence;

CREATE SEQUENCE hibernate_sequence
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

--
-- Name: notification; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE notification (
  id BIGINT NOT NULL,
  body TEXT,
  creation timestamp without time zone,
  notif_read boolean,
  subject TEXT,
  tenant_id BIGINT NOT NULL,
  user_id BIGINT
);

--
-- Name: permission; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE permission (
  id BIGINT NOT NULL,
  descriptor TEXT,
  tenant_id BIGINT NOT NULL
);

--
-- Name: property; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE property (
  id BIGINT NOT NULL,
  propertykey TEXT,
  propertyvalue TEXT,
  tenant_id BIGINT NOT NULL
);

--
-- Name: reservation; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE reservation (
  id BIGINT NOT NULL,
  datecreated timestamp without time zone,
  endtime timestamp without time zone,
  starttime timestamp without time zone,
  status TEXT,
  title TEXT,
  tenant_id BIGINT NOT NULL,
  resource_id BIGINT,
  user_id BIGINT
);

--
-- Name: reservationdecision; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE reservationdecision (
  id BIGINT NOT NULL,
  approved boolean NOT NULL,
  comment TEXT,
  tenant_id BIGINT NOT NULL,
  reservation_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  usergroup_id BIGINT NOT NULL
);

--
-- Name: reservationfield; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE reservationfield (
  id BIGINT NOT NULL,
  description TEXT,
  multiline boolean NOT NULL,
  required boolean NOT NULL,
  title TEXT,
  tenant_id BIGINT NOT NULL,
  resourcecategory_id BIGINT
);

--
-- Name: reservationfield_reservationfieldentry; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE reservationfield_reservationfieldentry (
  reservationfield_id BIGINT NOT NULL,
  reservationfieldentries_id BIGINT NOT NULL
);

--
-- Name: reservationfieldentry; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE reservationfieldentry (
  id BIGINT NOT NULL,
  content TEXT,
  tenant_id BIGINT NOT NULL,
  field_id BIGINT,
  reservation_id BIGINT
);

--
-- Name: resource; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE resource (
  id BIGINT NOT NULL,
  name TEXT,
  needsapproval boolean,
  tenant_id BIGINT NOT NULL,
  image_id BIGINT,
  owner_id BIGINT,
  resourcecategory_id BIGINT
);

--
-- Name: resource_tag; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE resource_tag (
  resources_id BIGINT NOT NULL,
  tags_id BIGINT NOT NULL
);

--
-- Name: resourcecategory; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE resourcecategory (
  id BIGINT NOT NULL,
  name TEXT,
  tenant_id BIGINT NOT NULL
);

--
-- Name: tag; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE tag (
  id BIGINT NOT NULL,
  name TEXT,
  tenant_id BIGINT NOT NULL,
  resourcecategory_id BIGINT NOT NULL
);

--
-- Name: tenant; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE tenant (
  id BIGINT NOT NULL,
  active boolean NOT NULL,
  slug TEXT NOT NULL,
  subscriptionid BIGINT NOT NULL,
  timesetinactive timestamp without time zone
);

--
-- Name: user; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE "user" (
  id BIGINT NOT NULL,
  emailaddress TEXT,
  firstname TEXT,
  hashedpassword TEXT,
  lastname TEXT,
  location TEXT,
  notificationtypesettings TEXT,
  phonenumber TEXT,
  userstate TEXT,
  verificationcode TEXT,
  verified boolean NOT NULL,
  tenant_id BIGINT NOT NULL
);

--
-- Name: user_permission; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE user_permission (
  users_id BIGINT NOT NULL,
  permissions_id BIGINT NOT NULL
);

--
-- Name: user_usergroup; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE user_usergroup (
  users_id BIGINT NOT NULL,
  usergroups_id BIGINT NOT NULL
);

--
-- Name: usergroup; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE usergroup (
  id BIGINT NOT NULL,
  name TEXT,
  tenant_id BIGINT NOT NULL,
  parent_id BIGINT
);

--
-- Name: usergroup_permission; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE usergroup_permission (
  usergroups_id BIGINT NOT NULL,
  permissions_id BIGINT NOT NULL
);

--
-- Name: file_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY file
  ADD CONSTRAINT file_pkey PRIMARY KEY (id);


--
-- Name: notification_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY notification
  ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: permission_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY permission
  ADD CONSTRAINT permission_pkey PRIMARY KEY (id);


--
-- Name: property_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY property
  ADD CONSTRAINT property_pkey PRIMARY KEY (id);


--
-- Name: reservation_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY reservation
  ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);


--
-- Name: reservationdecision_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY reservationdecision
  ADD CONSTRAINT reservationdecision_pkey PRIMARY KEY (id);


--
-- Name: reservationfield_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY reservationfield
  ADD CONSTRAINT reservationfield_pkey PRIMARY KEY (id);


--
-- Name: reservationfieldentry_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY reservationfieldentry
  ADD CONSTRAINT reservationfieldentry_pkey PRIMARY KEY (id);


--
-- Name: resource_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY resource
  ADD CONSTRAINT resource_pkey PRIMARY KEY (id);


--
-- Name: resourcecategory_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY resourcecategory
  ADD CONSTRAINT resourcecategory_pkey PRIMARY KEY (id);


--
-- Name: tag_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY tag
  ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: tenant_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY tenant
  ADD CONSTRAINT tenant_pkey PRIMARY KEY (id);


--
-- Name: uk_reservationfieldentries_id; Type: CONSTRAINT; Schema: public; Tablespace:
--

ALTER TABLE ONLY reservationfield_reservationfieldentry
  ADD CONSTRAINT uk_reservationfieldentries_id UNIQUE (reservationfieldentries_id);


--
-- Name: uk_slug; Type: CONSTRAINT; Schema: public; Tablespace:
--

ALTER TABLE ONLY tenant
  ADD CONSTRAINT uk_slug UNIQUE (slug);


--
-- Name: uk_subscriptionid; Type: CONSTRAINT; Schema: public; Tablespace:
--

ALTER TABLE ONLY tenant
  ADD CONSTRAINT uk_subscriptionid UNIQUE (subscriptionid);


--
-- Name: user_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY "user"
  ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: usergroup_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY usergroup
  ADD CONSTRAINT usergroup_pkey PRIMARY KEY (id);


--
-- Name: fk_field_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationfieldentry
  ADD CONSTRAINT fk_field_id FOREIGN KEY (field_id) REFERENCES reservationfield(id);


--
-- Name: fk_image_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY resource
  ADD CONSTRAINT fk_image_id FOREIGN KEY (image_id) REFERENCES file(id);


--
-- Name: fk_owner_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY resource
  ADD CONSTRAINT fk_owner_id FOREIGN KEY (owner_id) REFERENCES usergroup(id);


--
-- Name: fk_parent_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY usergroup
  ADD CONSTRAINT fk_parent_id FOREIGN KEY (parent_id) REFERENCES usergroup(id);


--
-- Name: fk_permissions_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY user_permission
  ADD CONSTRAINT fk_permissions_id FOREIGN KEY (permissions_id) REFERENCES permission(id);


--
-- Name: fk_permissions_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY usergroup_permission
  ADD CONSTRAINT fk_permissions_id FOREIGN KEY (permissions_id) REFERENCES permission(id);


--
-- Name: fk_reservation_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationdecision
  ADD CONSTRAINT fk_reservation_id FOREIGN KEY (reservation_id) REFERENCES reservation(id);


--
-- Name: fk_reservation_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationfieldentry
  ADD CONSTRAINT fk_reservation_id FOREIGN KEY (reservation_id) REFERENCES reservation(id);


--
-- Name: fk_reservationfield_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationfield_reservationfieldentry
  ADD CONSTRAINT fk_reservationfield_id FOREIGN KEY (reservationfield_id) REFERENCES reservationfield(id);


--
-- Name: fk_reservationfieldentries_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationfield_reservationfieldentry
  ADD CONSTRAINT fk_reservationfieldentries_id FOREIGN KEY (reservationfieldentries_id) REFERENCES reservationfieldentry(id);


--
-- Name: fk_resource_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservation
  ADD CONSTRAINT fk_resource_id FOREIGN KEY (resource_id) REFERENCES resource(id);


--
-- Name: fk_resourcecategory_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationfield
  ADD CONSTRAINT fk_resourcecategory_id FOREIGN KEY (resourcecategory_id) REFERENCES resourcecategory(id);


--
-- Name: fk_resourcecategory_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY resource
  ADD CONSTRAINT fk_resourcecategory_id FOREIGN KEY (resourcecategory_id) REFERENCES resourcecategory(id);


--
-- Name: fk_resourcecategory_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY tag
  ADD CONSTRAINT fk_resourcecategory_id FOREIGN KEY (resourcecategory_id) REFERENCES resourcecategory(id);


--
-- Name: fk_resources_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY resource_tag
  ADD CONSTRAINT fk_resources_id FOREIGN KEY (resources_id) REFERENCES resource(id);


--
-- Name: fk_tags_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY resource_tag
  ADD CONSTRAINT fk_tags_id FOREIGN KEY (tags_id) REFERENCES tag(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY file
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY notification
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY permission
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY property
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservation
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationdecision
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationfield
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationfieldentry
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY resource
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY resourcecategory
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY tag
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY "user"
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_tenant_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY usergroup
  ADD CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenant(id);


--
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY notification
  ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES "user"(id);


--
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservation
  ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES "user"(id);


--
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationdecision
  ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES "user"(id);


--
-- Name: fk_usergroup_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY reservationdecision
  ADD CONSTRAINT fk_usergroup_id FOREIGN KEY (usergroup_id) REFERENCES usergroup(id);


--
-- Name: fk_usergroups_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY user_usergroup
  ADD CONSTRAINT fk_usergroups_id FOREIGN KEY (usergroups_id) REFERENCES usergroup(id);


--
-- Name: fk_usergroups_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY usergroup_permission
  ADD CONSTRAINT fk_usergroups_id FOREIGN KEY (usergroups_id) REFERENCES usergroup(id);


--
-- Name: fk_users_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY user_permission
  ADD CONSTRAINT fk_users_id FOREIGN KEY (users_id) REFERENCES "user"(id);


--
-- Name: fk_users_id; Type: FK CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY user_usergroup
  ADD CONSTRAINT fk_users_id FOREIGN KEY (users_id) REFERENCES "user"(id);

--
-- PostgreSQL database dump complete
--

