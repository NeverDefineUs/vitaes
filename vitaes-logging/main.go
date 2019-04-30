package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

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

	hashedEmail := r.Form.Get("hashed_email")
	hashedCv := r.Form.Get("hashed_cv")
	step := r.Form.Get("step")
	description := r.Form.Get("description")
	exception := r.Form.Get("exception")

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
	_, err = stmt.Exec(hashedEmail, hashedCv, step, description, exception)
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
		cv TEXT NOT NULL,
		step TEXT,
		description TEXT,
		exception TEXT,
		PRIMARY KEY (time, email, cv)
	);
	`
	_, err = db.Exec(createTableStmt)
	failOnError(err, "Failed to create table")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handler(w, r, db)
	})
	log.Fatal(http.ListenAndServe(":8017", nil))
}
