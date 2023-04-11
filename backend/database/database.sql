CREATE DATABASE cbmtb;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  user_id UUID DEFAULT UUID_generate_v4(),
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  user_first_name VARCHAR(255) NOT NULL,
  user_last_name VARCHAR(255) NOT NULL,
  user_cpf VARCHAR(255) NOT NULL,
  user_gender VARCHAR(255) NOT NULL,
  user_phone VARCHAR(255) NOT NULL,
  user_birth_date DATE NOT NULL,
  user_cep VARCHAR(255) NOT NULL,
  user_state VARCHAR(2) NOT NULL,
  user_city VARCHAR(255) NOT NULL,
  user_address VARCHAR(255) NOT NULL,
  user_number VARCHAR(255),
  user_apartment VARCHAR(255),
  user_role VARCHAR(255) NOT NULL,
  user_confirmed BOOLEAN NOT NULL,
  PRIMARY KEY(user_id)
);

CREATE TABLE events(
  event_id UUID DEFAULT UUID_generate_v4(),
  event_link VARCHAR(20) UNIQUE,
  event_external VARCHAR(255),
  event_name VARCHAR(255) NOT NULL,
  event_location VARCHAR(255) NOT NULL,
  event_image VARCHAR(255),
  event_date_start TIMESTAMP WITH TIME ZONE,
  event_date_end TIMESTAMP WITH TIME ZONE,
  event_registrations_start TIMESTAMP WITH TIME ZONE,
  event_registrations_end TIMESTAMP WITH TIME ZONE,
  event_description TEXT,
  event_rules TEXT,
  event_details TEXT,
  event_max_attendees INTEGER NOT NULL,
  event_current_attendees INTEGER NOT NULL,
  event_status BOOLEAN NOT NULL,
  event_owner_id UUID NOT NULL,
  PRIMARY KEY(event_id),
  FOREIGN KEY (event_owner_id) REFERENCES users(user_id)
);

CREATE TABLE event_categories(
  category_id UUID DEFAULT UUID_generate_v4(),
  event_id UUID NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  category_price REAL NOT NULL,
  category_minage INTEGER,
  category_maxage INTEGER,
  category_gender VARCHAR(255) NOT NULL,
  PRIMARY KEY (category_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE payments(
  payment_id UUID DEFAULT UUID_generate_v4(),
  payment_txid VARCHAR(255) NOT NULL UNIQUE,
  payment_value REAL NOT NULL,
  user_id UUID NOT NULL,
  event_id UUID NOT NULL,
  payment_status VARCHAR(255) NOT NULL,
  PRIMARY KEY(payment_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE registrations(
  registration_id UUID DEFAULT UUID_generate_v4(),
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  category_id UUID NOT NULL,
  payment_id UUID,
  coupon_id UUID,
  registration_shirt VARCHAR(255),
  registration_status VARCHAR(255) NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY(registration_id),
  FOREIGN KEY (category_id) REFERENCES event_categories(category_id),
  FOREIGN KEY (payment_id) REFERENCES payments(payment_id),
  FOREIGN KEY (coupon_id) REFERENCES event_coupons(coupon_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE federations(
  federation_id UUID DEFAULT UUID_generate_v4(),
  federation_name VARCHAR(255) NOT NULL UNIQUE,
  federation_state VARCHAR(2) NOT NULL UNIQUE,
  federation_site VARCHAR(255) NOT NULL,
  federation_phone VARCHAR(255) NOT NULL,
  federation_address VARCHAR(255) NOT NULL,
  PRIMARY KEY(federation_id)
);

CREATE TABLE press(
  press_id UUID DEFAULT UUID_generate_v4(),
  press_rep VARCHAR(255) NOT NULL UNIQUE,
  press_email VARCHAR(255) NOT NULL UNIQUE,
  press_phone VARCHAR(255) NOT NULL UNIQUE,
  press_cpf VARCHAR(255) NOT NULL,
  press_type VARCHAR(255) NOT NULL,
  press_vehicle VARCHAR(255) NOT NULL,
  press_comment TEXT,
  PRIMARY KEY(press_id)
);

CREATE TABLE tickets(
  ticket_id UUID DEFAULT UUID_generate_v4(),
  ticket_name VARCHAR(255) NOT NULL UNIQUE,
  ticket_email VARCHAR(255) NOT NULL UNIQUE,
  ticket_phone VARCHAR(255) NOT NULL UNIQUE,
  ticket_message TEXT NOT NULL,
  ticket_date TIMESTAMP WITH TIME ZONE,
  ticket_status VARCHAR(255) NOT NULL,
  PRIMARY KEY(ticket_id)
);

CREATE TABLE clubs(
  club_id UUID DEFAULT UUID_generate_v4(),
  federation_state VARCHAR(2) NOT NULL UNIQUE,
  club_site VARCHAR(255) NOT NULL,
  club_phone VARCHAR(255) NOT NULL,
  club_address VARCHAR(255) NOT NULL,
  PRIMARY KEY(club_id),
  FOREIGN KEY (federation_state) REFERENCES federations(federation_state)
);

CREATE TABLE news_categories(
 category_id UUID DEFAULT UUID_generate_v4(),
 category_name VARCHAR(20) NOT NULL UNIQUE,
 PRIMARY KEY (category_id)
);

CREATE TABLE news(
  news_id UUID DEFAULT UUID_generate_v4(),
  news_link VARCHAR(20) NOT NULL UNIQUE,
  news_title VARCHAR(255) UNIQUE,
  news_subtitle VARCHAR(255) UNIQUE,
  news_image_link VARCHAR(255),
  news_date TIMESTAMP NOT NULL,
  news_last_update TIMESTAMP NOT NULL,
  user_id UUID NOT NULL,
  news_text TEXT NOT NULL,
  news_category VARCHAR(20) DEFAULT 'Geral',
  news_status BOOLEAN DEFAULT false,
  PRIMARY KEY(news_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (news_category) REFERENCES news_categories(category_name)
);

CREATE TABLE documents(
  document_id UUID DEFAULT UUID_generate_v4(),
  document_link VARCHAR(255) NOT NULL UNIQUE,
  document_title VARCHAR(50) NOT NULL UNIQUE,
  document_description VARCHAR(255) UNIQUE,
  document_year INTEGER,
  document_general BOOLEAN DEFAULT false,
  user_id UUID NOT NULL,
  PRIMARY KEY(document_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE email_confirmations(
 confirmation_id UUID DEFAULT UUID_generate_v4(),
 register_date TIMESTAMP NOT NULL,
 user_id UUID NOT NULL,
 confirmation_status BOOLEAN NOT NULL,
 PRIMARY KEY (confirmation_id),
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE newsletter_subscribers(
 subscriber_id UUID DEFAULT UUID_generate_v4(),
 subscriber_email VARCHAR(255) NOT NULL,
 PRIMARY KEY (subscriber_id)
);

CREATE TABLE password_resets(
 reset_id UUID DEFAULT UUID_generate_v4(),
 reset_email VARCHAR(255) NOT NULL,
 reset_user_id UUID NOT NULL,
 reset_expiration TIMESTAMPTZ NOT NULL,
 PRIMARY KEY(reset_id),
 FOREIGN KEY(reset_email) REFERENCES users(user_email),
 FOREIGN KEY(reset_user_id) REFERENCES users(user_id)
);

CREATE TABLE event_coupons(
 coupon_id UUID DEFAULT UUID_generate_v4(),
 event_id UUID NOT NULL,
 coupon_link VARCHAR(30) NOT NULL,
 coupon_discount REAL,
 coupon_uses INTEGER,
 PRIMARY KEY (category_id),
 FOREIGN KEY (event_id) REFERENCES events(event_id)
);


CREATE OR REPLACE FUNCTION update_num_attendees() RETURNS TRIGGER AS $$
BEGIN
 -- Update the number of attendees for the corresponding event when a row is inserted into the registration table
 IF (TG_OP = 'INSERT') THEN
  UPDATE events
  SET event_current_attendees = (
   SELECT COUNT(*)
   FROM registrations
   WHERE event_id = NEW.event_id
  )
  WHERE event_id = NEW.event_id;

  RETURN NEW;

 -- Update the number of attendees for the corresponding event when a row is deleted from the registration table
 ELSIF (TG_OP = 'DELETE') THEN
  UPDATE events
  SET event_current_attendees = (
   SELECT COUNT(*)
   FROM registrations
   WHERE event_id = OLD.event_id
  )
  WHERE event_id = OLD.event_id;

  RETURN OLD;
 END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_num_attendees_trigger
AFTER INSERT OR DELETE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_num_attendees();