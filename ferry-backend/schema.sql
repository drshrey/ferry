drop database ferrydb;

--
-- PostgreSQL database schema
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

-- the schema

CREATE USER shreyas;
ALTER USER shreyas PASSWORD '';
CREATE DATABASE ferrydb;
GRANT ALL PRIVILEGES ON DATABASE ferrydb TO shreyas;
\c ferrydb;


--
-- Name: assets; Type: TABLE; Schema: public; Owner: database_user
--

create table users (
    id serial primary key,
    email text unique not null,
    salt text,
    hash text,
    first_name text not null,
    last_name text not null,
    traveller_id integer,
    buyer_id integer
);

create table travellers (
    id serial primary key,
    street_address text not null,
    state text not null,
    zip_code text not null,
    is_verified boolean not null
);

create table buyers (
    id serial primary key,
    stripe_customer_id text not null,
    stripe_card_token text not null
);

create table trips (
    id serial primary key,
    traveller_id integer not null,
    arrival_date date not null,
    destination_city_id integer not null
);

create table orders (
    id serial primary key,
    item_id integer not null,
    buyer_id integer not null,
    match_id integer not null
);

create table matches (
    id serial primary key,
    trip_id integer not null,
    status text not null
);

create table items (
    id serial primary key,
    title text not null,
    price decimal not null,
    filepath text not null,
    url text not null,
    status text
);

create table cities (
    id serial primary key,
    name text not null,
    state text,
    country text not null
);

ALTER TABLE users OWNER TO shreyas;
alter table travellers owner to shreyas;
alter table buyers owner to shreyas;
ALTER TABLE trips OWNER to shreyas;
alter table orders owner to shreyas;
alter table matches owner to shreyas;
alter table items owner to shreyas;
alter table cities owner to shreyas;


insert into items (title, price, filepath, url, status)
values ('Apple iPhone 6 64GB Unlocked Smartphone - Gold (Certified Refurbished)', 359.99,
    '/items/iphone.jpg',
    'https://www.amazon.com/Apple-iPhone-64GB-Unlocked-Smartphone/dp/B00YD548Q0/ref=sr_1_1?s=wireless&ie=UTF8&qid=1494104091&sr=1-1&keywords=iphone',
    'alive');

insert into items (title, price, filepath, url, status)
values ('Apple iPhone 5S 16GB Silver GSM Unlocked (Certified Refurbished)', 
    174.00,
    '/items/iphone-5.jpg',
    'https://www.amazon.com/Apple-iPhone-5S-Certified-Refurbished/dp/B00YD53YQU/ref=sr_1_2?s=wireless&ie=UTF8&qid=1494104091&sr=1-2&keywords=iphone',
    'alive');

insert into items (title, price, filepath, url, status)
values ('SENSO Bluetooth Headphones, Best Wireless Sports Earphones w/ Mic IPX7 Waterproof HD Stereo Sweatproof Earbuds for Gym Running Workout 8 Hour Battery Noise Cancelling Headsets', 
    36.97,
    '/items/senso-headphones.jpg',
    'https://www.amazon.com/gp/product/B01G8JO5F2/ref=s9_acsd_ri_bw_c_x_3_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-12&pf_rd_r=2V6C00ER58B3QNE1VJGC&pf_rd_r=2V6C00ER58B3QNE1VJGC&pf_rd_t=101&pf_rd_p=b2696980-2bae-4972-b6ef-046f11ecdbcf&pf_rd_p=b2696980-2bae-4972-b6ef-046f11ecdbcf&pf_rd_i=172282',
    'alive');

insert into items (title, price, filepath, url, status)
values ('Kindle E-reader - Black, 6 inches Glare-Free Touchscreen Display, Wi-Fi - Includes Special Offers', 
    79.99,
    '/items/kindle.jpg',
    'https://www.amazon.com/dp/B00ZV9PXP2/ref=fs_ods_fs_eink_eb?th=1',
    'alive');

insert into items (title, price, filepath, url, status)
values ('G4Free 12x25 Waterproof Binoculars(BAK4,Green Lens),Large Eyepiece Super High-Powered Field Surveillance Binoculars', 
    27.99,
    '/items/binoculars.jpg',
    'https://www.amazon.com/gp/product/B00UUQ1VDY/ref=s9_acsd_cdeal_hd_bw_b26h8_c_x_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-5&pf_rd_r=B1D22QKGJW2QSVVN57EV&pf_rd_t=101&pf_rd_p=eb5ac887-b1a5-5e13-9f6e-0042673042de&pf_rd_i=502394',
    'alive');




insert into cities (name, state, country)
values (
    'San José',
    'San José',
    'Costa Rica'
);

insert into cities (name, state, country)
values (
    'Puerto Limón',
    'Limón',
    'Costa Rica'
);

insert into cities (name, state, country)
values (
    'San Francisco',
    'Heredia',
    'Costa Rica'
);

insert into cities (name, state, country)
values(
    'Alajuela',
    'Alajuela',
    'Costa Rica'
);

insert into cities (name, state, country)
values(
    'Liberia',
    'Guanacaste',
    'Costa Rica'
);
