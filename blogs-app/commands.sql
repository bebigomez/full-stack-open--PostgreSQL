CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

INSERT INTO blogs (title, author, url) VALUES ('First ever blog', 'bebi', 'https://bebidev.netlify.app');

INSERT INTO blogs (title, author, url) VALUES ('Second blog post', 'John Doe', 'https://youtube.com');

SELECT * FROM blogs;
