package stolas

import (
	"database/sql"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	_ "github.com/mattn/go-sqlite3" // sqlite
)

// Server stolas server structure
type Server struct {
	sqliteClient *sql.DB
}

// Client stolas client structure
type Client struct {
	address string
}

// NewServer initialize stolas server
func NewServer(dbFilePath string) (*Server, error) {
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

	return &Server{
		sqliteClient: db,
	}, nil
}

// Close closes database connection
func (s *Server) Close() {
	s.sqliteClient.Close()
}

// LogStep logs data
func (s *Server) LogStep(email, cvHash, origin, step, data, stacktrace string) error {
	stmt, err := s.sqliteClient.Prepare(logStmt)
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

// NewClient initialize stolas client
func NewClient(address string) *Client {
	return &Client{
		address: address,
	}
}

// LogStep logs data
func (c *Client) LogStep(email, cvHash, origin, step, data, stacktrace string) error {
	client := &http.Client{}
	form := url.Values{}
	form.Add("email", email)
	form.Add("cv_hash", cvHash)
	form.Add("origin", origin)
	form.Add("step", step)
	form.Add("data", data)
	form.Add("stacktrace", stacktrace)
	req, err := http.NewRequest("POST", c.address, strings.NewReader(form.Encode()))
	if err != nil {
		return err
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	_, err = client.Do(req)
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
