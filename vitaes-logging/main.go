package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func vitaesLog(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	err := r.ParseForm()
	failOnError(err, "Failed to parse params")

	email := r.Form.Get("email")
	cvHash := r.Form.Get("cv_hash")
	origin := r.Form.Get("origin")
	step := r.Form.Get("step")
	data := r.Form.Get("data")

	logStmt := `
	INSERT INTO "cv_gen_tracking" VALUES(
		strftime('%Y-%m-%d %H-%M-%f','now'),
		?,
		?,
		?,
		?,
		?
	);
	`
	stmt, err := db.Prepare(logStmt)
	failOnError(err, "Failed to prepare logging query")
	defer stmt.Close()
	_, err = stmt.Exec(email, cvHash, origin, step, data)
	failOnError(err, "Failed to execute insert query")
}

func handler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "POST":
		vitaesLog(w, r, db)
	}
}

func main() {
	file := os.Getenv("SQLITE_DATABASE")
	db, err := sql.Open("sqlite3", "./data/"+file)
	failOnError(err, "Failed to initalize database connection")
	defer db.Close()

	createTableStmt := `
	CREATE TABLE IF NOT EXISTS "cv_gen_tracking" (
		time TEXT NOT NULL,
		email TEXT NOT NULL,
		cv_hash TEXT NOT NULL,
		origin TEXT,
		step TEXT,
		data TEXT,
		PRIMARY KEY (time, email, cv_hash)
	);
	`
	_, err = db.Exec(createTableStmt)
	failOnError(err, "Failed to create table")

	go func() {
		for {
			deleteStaleStmt := `
			DELETE FROM "cv_gen_tracking" WHERE "time" < strftime('%Y-%m-%d %H-%M-%f', date('now', '-27 days'));
			`
			_, err = db.Exec(deleteStaleStmt)
			failOnError(err, "Failed to delete stale rows")
			time.Sleep(10 * time.Minute)
		}
	}()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handler(w, r, db)
	})
	log.Fatal(http.ListenAndServe(":8017", nil))
}
