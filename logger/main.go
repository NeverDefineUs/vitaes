package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3" // sqlite
	"github.com/rs/cors"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

var db *sql.DB

// LogStep logs data
func LogStep(email, cvHash, origin, step, data string) {
	logStmt := `
	INSERT INTO "cv_gen_tracking"(email, cv_hash, origin, step, data) VALUES(
		?,
		?,
		?,
		?,
		?
	);
	`
	stmt, err := db.Prepare(logStmt)
	failOnError(err, "Failed to prepare logger query")
	defer stmt.Close()
	if data != "" {
		_, err = stmt.Exec(email, cvHash, origin, step, data)
	} else {
		_, err = stmt.Exec(email, cvHash, origin, step, nil)
	}
	failOnError(err, "Failed to execute insert query")
}

func logHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	failOnError(err, "Failed to parse params")

	email := r.Form.Get("email")
	cvHash := r.Form.Get("cv_hash")
	origin := r.Form.Get("origin")
	step := r.Form.Get("step")
	data := r.Form.Get("data")

	LogStep(email, cvHash, origin, step, data)
}

func main() {
	file := os.Getenv("SQLITE_DATABASE")
	db, err := sql.Open("sqlite3", "/data/"+file)
	failOnError(err, "Failed to initalize database connection")
	defer db.Close()

	createTableStmt := `
	CREATE TABLE IF NOT EXISTS "cv_gen_tracking" (
		time TEXT DEFAULT(strftime('%Y-%m-%d %H-%M-%f','now')) NOT NULL,
		email TEXT NOT NULL,
		cv_hash TEXT NOT NULL,
		origin TEXT NOT NULL,
		step TEXT NOT NULL,
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

	router := mux.NewRouter()
	router.HandleFunc("/", logHandler).Methods("POST")
	handler := cors.Default().Handler(router)
	log.Fatal(http.ListenAndServe(":6000", handler))
}
