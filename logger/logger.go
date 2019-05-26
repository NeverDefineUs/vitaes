package logger

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3" // sqlite
)

type Client struct {
	db *sql.DB
}

func errMsg(err error, msg string) string {
	return fmt.Sprintf("%s: %s", msg, err)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatal(errMsg(err, msg))
	}
}

func stringOrNil(value string) interface{} {
	if value != "" {
		return value
	}
	return nil
}

// LogStep logs data
func (c *Client) LogStep(email, cvHash, origin, step, data, stacktrace string) (string, error) {
	logStmt := `
	INSERT INTO "cv_gen_tracking"(email, cv_hash, origin, step, data, stacktrace) VALUES(
		?,
		?,
		?,
		?,
		?,
		?
	);
	`
	stmt, err := c.db.Prepare(logStmt)
	if err != nil {
		return "Failed to prepare logger query", err
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
	if err != nil {
		return "Failed to execute insert query", err
	}
	return "success", nil
}

func (c *Client) CleanUpJob() {
	go func(db *sql.DB) {
		for {
			deleteStaleStmt := `
			DELETE FROM "cv_gen_tracking" WHERE "time" < strftime('%Y-%m-%d %H-%M-%f', date('now', '-27 days'));
			`
			_, err := db.Exec(deleteStaleStmt)
			failOnError(err, "Failed to delete stale rows")
			time.Sleep(10 * time.Minute)
		}
	}(c.db)
}

func (c *Client) Close() {
	c.db.Close()
}

func Init() *Client {
	file := os.Getenv("SQLITE_DATABASE")
	db, err := sql.Open("sqlite3", "/data/"+file)
	failOnError(err, "Failed to initalize database connection")

	createTableStmt := `
	CREATE TABLE IF NOT EXISTS "cv_gen_tracking" (
		time TEXT DEFAULT(strftime('%Y-%m-%d %H-%M-%f','now')) NOT NULL,
		email TEXT,
		cv_hash TEXT,
		origin TEXT NOT NULL,
		step TEXT NOT NULL,
		data TEXT,
		stacktrace TEXT,
		PRIMARY KEY (time, email, cv_hash)
	);
	`
	_, err = db.Exec(createTableStmt)
	failOnError(err, "Failed to create table")

	return &Client{
		db: db,
	}
}
