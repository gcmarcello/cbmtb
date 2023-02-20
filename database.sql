CREATE DATABASE cbmtb;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    user_id UUID DEFAULT UUID_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_given_name VARCHAR(255) NOT NULL,
    user_last_name VARCHAR(255) NOT NULL,
    user_cpf VARCHAR(255) NOT NULL,
    user_gender VARCHAR(255) NOT NULL,
    user_phone VARCHAR(255) NOT NULL,
    user_birth_date DATE NOT NULL,
    user_cep VARCHAR(255) NOT NULL,
    user_state VARCHAR(2) NOT NULL,
    user_city VARCHAR(255) NOT NULL,
    user_neighborhood VARCHAR(255),
    user_street VARCHAR(255) NOT NULL,
    user_number VARCHAR(255),
    user_apartment VARCHAR(255),
    user_role VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE events(
    event_id UUID DEFAULT UUID_generate_v4(),
    event_link VARCHAR(20) UNIQUE,
    event_owner_id UUID NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_image VARCHAR(255),
    event_date DATE NOT NULL,
    event_price INTEGER NOT NULL,
    event_description TEXT,
    event_rules TEXT,
    event_details TEXT,
    event_max_attendees INTEGER NOT NULL,
    event_current_attendees INTEGER NOT NULL,
    event_status BOOLEAN NOT NULL,
    PRIMARY KEY(event_id),
    FOREIGN KEY (event_owner_id) REFERENCES users(user_id)
);

CREATE TABLE categories(
    category_id UUID DEFAULT UUID_generate_v4(),
    event_id UUID NOT NULL,
    category_name VARCHAR(255) NOT NULL,
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
    payment_id UUID NOT NULL,
    registration_shirt VARCHAR(255),
    registration_status VARCHAR(255) NOT NULL,
    PRIMARY KEY(registration_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
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