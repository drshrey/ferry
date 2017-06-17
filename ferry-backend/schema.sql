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

CREATE USER drshrey;
ALTER USER drshrey PASSWORD '';
CREATE DATABASE ferrydb;
GRANT ALL PRIVILEGES ON DATABASE ferrydb TO drshrey;
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
    buyer_id integer,
    profile_picture_url text
);

create table travellers (
    id serial primary key,
    street_address text not null,
    public_token text not null,
    state text not null,
    zip_code text not null,
    country text not null,
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
    destination_city_id integer not null,
    departure_date date not null,
    status integer not null,
    size integer not null
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
    status integer not null,
    first_msg text
);

create table items (
    id serial primary key,
    title text not null,
    category text not null,
    description text,
    price decimal not null,
    filepath text not null,
    url text not null,
    status text,
    size integer not null
);

create table cities (
    id serial primary key,
    name text not null,
    state text,
    country text not null
);

ALTER TABLE users OWNER TO drshrey;
alter table travellers owner to drshrey;
alter table buyers owner to drshrey;
ALTER TABLE trips OWNER to drshrey;
alter table orders owner to drshrey;
alter table matches owner to drshrey;
alter table items owner to drshrey;
alter table cities owner to drshrey;



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

INSERT INTO items(title,category,price,description,url,status,filepath, size) VALUES ('Echo Dot (2nd Generation) - Black','Electronics',39.99,'Echo Dot (2nd Generation) is a hands-free, voice-controlled device that uses Alexa to play music, control smart home devices, make calls, send and receive messages, provide information, read the news, set alarms, read audiobooks from Audible, and more.','https://www.amazon.com/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO/ref=zg_bs_electronics_1?_encoding=UTF8&psc=1&refRID=FT074Y43ZFBY853JRB7N','alive','https://images-na.ssl-images-amazon.com/images/I/61ikAJnULvL._SL1000_.jpg', 30);
INSERT INTO items(title,category,price,description,url,status,filepath, size) VALUES ('Fire TV Stick with Alexa Voice Remote','Electronics',39.99,'Just plug Fire TV Stick into your HDTV and start streaming in minutes. Use the included Alexa Voice Remote to find the best way to watch across more than 140 channels and apps with universal search. With the fastest Wi-Fi and most accurate voice search of any streaming media stick, shows and movies start faster and stream smoother than ever.','https://www.amazon.com/Amazon-Fire-TV-Stick-With-Alexa-Voice-Remote-Streaming-Media-Player/dp/B00ZV9RDKK/ref=zg_bs_electronics_2?_encoding=UTF8&psc=1&refRID=FT074Y43ZFBY853JRB7N','alive','https://images-na.ssl-images-amazon.com/images/I/51D8NXwQfvL._SL1000_.jpg', 20);
INSERT INTO items(title,category,price,description,url,status,filepath, size) VALUES ('GoPro HERO5 Black', 'Electronics', 349, 'Smooth stabilized video, crystal-clear audio and pro-quality photo capture combine with GPS to make HERO5 Black simply the best GoPro. And when it’s time to edit and share, HERO5 Black automatically uploads footage to your GoPro Plus cloud account to provide easy access on your phone. Then, you can create amazing videos automatically with Quik, the GoPro editing app.', 'https://www.amazon.com/GoPro-CHDHX-501-HERO5-Black/dp/B01M14ATO0/ref=zg_bs_electronics_15?_encoding=UTF8&psc=1&refRID=FT074Y43ZFBY853JRB7N', 'alive', 'https://images-na.ssl-images-amazon.com/images/I/61B3h4thkvL._SL1500_.jpg', 40);
INSERT INTO items(title,category,price,description,url,status,filepath, size) VALUES ('Nextbit Robin Factory (Unlocked GSM)', 'Electronics', 129.99, 'With the cloud integrated into Android OS, your onboard storage is merged with the cloud, so you always have the space you need. Robin seamlessly backs up your apps and photos, intelligently archives the stuff you are not using, and easily restores items when you need them. Robin is designed to Stand out. It is simple and distinct in form and function: every port, button, and sensor is thoughtfully placed and easy to use.', 'https://www.amazon.com/Nextbit-Robin-Factory-Unlocked-Smartphone/dp/B01D9LVCAI', 'alive', 'https://images-na.ssl-images-amazon.com/images/I/81N0IgYUf5L._SL1500_.jpg', 35);
INSERT INTO items(title,category,price,description,url,status,filepath, size) VALUES ('Samsung Galaxy J7 Prime (32GB) (Unlocked)', 'Electronics', 234.93, 'The revolutionary design of the Galaxy S8+ begins from the inside out. We rethought every part of the phone layout to break through the confines of the smartphone screen. So all you see is pure content and no bezel. It is the biggest, most immersive screen on a Galaxy smartphone of this size. And it is easy to hold in one hand.','https://www.amazon.com/Samsung-Galaxy-Prime-Factory-Unlocked/dp/B01M26XHKG', 'alive', 'https://images-na.ssl-images-amazon.com/images/I/717yO167dVL._SL1500_.jpg', 20);
INSERT INTO items(title,category,price,description,url,status,filepath, size) VALUES ('iRobot Roomba 960 Robotic Vacuum Cleaner', 'Electronics', 599.00, 'Roomba 960 seamlessly navigates room to room to clean an entire level of your home, recharging and resuming until the job is done. Featuring the revolutionary AeroForce Cleaning System, Roomba 960 delivers up to 5x the air power and requires less maintenance. Just press clean or schedule Roomba on the go with the iRobot Home App. Roomba works on all floor types, and at just 3.6 inches tall, is specifically designed to fit under most furniture, beds and kickboards.', 'https://www.amazon.com/gp/product/B01ID8H6NO/ref=s9_acss_bw_cg_sheggFD_3c1_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-3&pf_rd_r=AHV6VZNDY1Q58YMVABDK&pf_rd_t=101&pf_rd_p=36251adf-111b-4baf-81f3-3f444cfcef53&pf_rd_i=6563140011', 'alive', 'https://images-na.ssl-images-amazon.com/images/I/51YR9jp-yjL.jpg', 50);

-- insert into users( email, salt, hash, first_name, last_name, traveller_id, buyer_id, profile_picture_url)
-- values(
--     'test@gmail.com',
--     'salt',
--     'hash',
--     'first_name',
--     'last_name',
--     1,
--     null,
--     ''
-- );

-- insert into travellers(id, street_address, public_token, state, zip_code, country, is_verified)
-- values(
--     1,
--     'test address',
--     'test_token',
--     'state',
--     'zip_code',
--     'country',
--     TRUE
-- );

-- insert into trips(id, traveller_id, arrival_date, departure_date, destination_city_id, status, size)
-- values(
--     1,
--     1,
--     '06/29/17',
--     '07/01/17',
--     1,
--     0,
--     1
-- );
