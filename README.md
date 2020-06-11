# **URL SHORTENER MICROSERVICE**

This is a simple URL Shortener Microservice, **Not recommended for use on production**.

To use it just: `npm install`.

## **Features:**

- Generate shortened url.
- Retrieve Original URL with creation and expiration dates.
- Redirect the shortened URL for the original website.

## **Database:**

This project is based on SQLite3.

- Data base scheeme:
    Table Name: `url`.
    |LABEL           |TYPE     |CONSTRAINTS         |
    |----------------|---------|--------------------|
    |id              |INTEGER  |PRIMARY KEY NOT NULL|
    |long_url        |TEXT     |NOT NULL            |
    |hash            |TEXT     |UNIQUE NOT NULL     |
    |creation_date   |TEXT     |NOT NULL            |
    
## **Furute improvements:**

- Hash generation.
- Implement a routine to exclude expired URLs from the database.
