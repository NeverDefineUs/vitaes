package stolas

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3" // sqlite
)

// Client vlogger client structure
type Client struct {
	sqliteClient *sql.DB
}

// NewClient initialize vlogger client
func NewClient(dbFilePath string) (*Client, error) {
	db, err := sql.Open("sqlite3", dbFilePath)
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(createTableStmt)
	if err != nil {
		return nil, err
	}

	go func() {
		for {
			_, err := db.Exec(deleteStaleStmt)
			if err != nil {
				log.Println(err)
			}
			time.Sleep(10 * time.Minute)
		}
	}()

	return &Client{
		sqliteClient: db,
	}, nil
}

// Close closes database connection
func (c *Client) Close() {
	c.sqliteClient.Close()
}

// LogStep logs data
func (c *Client) LogStep(email, cvHash, origin, step, data, stacktrace string) error {
	stmt, err := c.sqliteClient.Prepare(logStmt)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		stringOrNil(email),
		stringOrNil(cvHash),
		stringOrNil(origin),
		stringOrNil(step),
		stringOrNil(data),
		stringOrNil(stacktrace),
	)
	return err
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func stringOrNil(value string) interface{} {
	if value != "" {
		return value
	}
	return nil
}

const createTableStmt = `
CREATE TABLE IF NOT EXISTS "cv_gen_tracking" (
	time TEXT DEFAULT(strftime('%Y-%m-%d %H-%M-%f','now')) NOT NULL,
	email TEXT,
	cv_hash TEXT,
	origin TEXT NOT NULL,
	step TEXT NOT NULL,
	data TEXT,
	stacktrace TEXT,
	PRIMARY KEY (time, email, cv_hash)
);`

const deleteStaleStmt = `
DELETE FROM "cv_gen_tracking" WHERE "time" < strftime('%Y-%m-%d %H-%M-%f', date('now', '-27 days'));`

const logStmt = `
INSERT INTO "cv_gen_tracking"(email, cv_hash, origin, step, data, stacktrace) VALUES(
	?,
	?,
	?,
	?,
	?,
	?
);`
