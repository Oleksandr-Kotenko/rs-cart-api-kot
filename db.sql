create extension if not exists "uuid-ossp";
create type status_type as enum('OPEN', 'ORDERED');

create table if not exists users(
	id uuid primary key default uuid_generate_v4(),
	name text not null,
    password text not null
);

create table if not exists carts(
	id uuid primary key default uuid_generate_v4(),
	user_id uuid not null,
    created_at date not null default CURRENT_DATE,
    updated_at date not null default CURRENT_DATE,
    status status_type,
    foreign key(user_id) references users(id)
);

create table if not exists products(
	id uuid primary key default uuid_generate_v4(),
	title text not null,
    description text not null,
    price DECIMAL(8, 2) not null
);

create table if not exists cart_items(
	cart_id uuid not null,
	product_id uuid not null,
    count integer,
    foreign key(cart_id) references carts(id) on delete cascade,
    foreign key(product_id) references products(id)
);

create table if not exists orders(
	id uuid primary key default uuid_generate_v4(),
	cart_id uuid not null,
	user_id uuid not null,
	payment Json not null,
  	delivery Json not null,
  	comments text,
  	status status_type,
    total DECIMAL(8, 2) not null,
    foreign key(cart_id) references carts(id),
    foreign key(user_id) references users(id)
);

insert into
	users
values
	('8fb5f7b9-7b73-42d7-a67f-ca6769dacc61','kot', 'testPassword'),
	('fcbaacf8-7679-4088-86df-0f73dc342cfe','admin', 'testPassword1');

insert into
	carts(user_id, status)
values
	('8fb5f7b9-7b73-42d7-a67f-ca6769dacc61','OPEN'),
	('fcbaacf8-7679-4088-86df-0f73dc342cfe','ORDERED');

insert into
	products
values
	('5f314dde-200b-4a4d-b9f0-803f9585a01b','Pierced Owl Rose Gold Plated Stainless Steel Double', 'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel', 10.99),
	('de168370-b6ac-4bec-bdd6-69f524bb9e7b','White Gold Plated Princess','Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentines Day...',9.99),
	('10877125-f827-403d-889d-58997dccad00','Mens Cotton Jacket','great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',55.99);

insert into
	cart_items
values
	('69ee5e20-9f76-41b2-8f31-6ca87d0e86b4','5f314dde-200b-4a4d-b9f0-803f9585a01b',10),
	('69ee5e20-9f76-41b2-8f31-6ca87d0e86b4','de168370-b6ac-4bec-bdd6-69f524bb9e7b',2),
	('954e112d-2416-4839-8979-3ab51cbafe96','10877125-f827-403d-889d-58997dccad00',5);

insert into
	orders(cart_id, user_id, payment, delivery, comments, status, total)
values
	('69ee5e20-9f76-41b2-8f31-6ca87d0e86b4', '8fb5f7b9-7b73-42d7-a67f-ca6769dacc61', '{ "type": "applePay", "address": "test", "creditCard": "test" }', '{ "type": "delivery", "address": "test" }', 'test', 'OPEN', 200.5);
