package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/neverdefineus/vitaes/lib/stolas"
	"github.com/rs/cors"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

var stl *stolas.Server

func logHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		http.Error(
			w,
			fmt.Sprintf("%s: %s", "Failed to parse params form", err),
			http.StatusInternalServerError,
		)
		return
	}

	email := r.Form.Get("email")
	cvHash := r.Form.Get("cv_hash")
	origin := r.Form.Get("origin")
	step := r.Form.Get("step")
	data := r.Form.Get("data")
	stacktrace := r.Form.Get("stacktrace")

	err = stl.LogStep(email, cvHash, origin, step, data, stacktrace)
	if err != nil {
		http.Error(
			w,
			fmt.Sprintf("%s: %s", "Failed to log step", err),
			http.StatusInternalServerError,
		)
		return
	}
}

func main() {
	file := os.Getenv("SQLITE_DATABASE")
	var err error
	stl, err = stolas.NewServer("/data/" + file)
	defer stl.Close()
	failOnError(err, "Failed to connect to sqlite")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost", "http://vitaes.io", "http://k8s.vitaes.io",
			"https://localhost", "https://vitaes.io", "https://k8s.vitaes.io",
		},
		AllowCredentials: true,
	})
	router := mux.NewRouter()
	router.HandleFunc("/", logHandler).Methods("POST")
	handler := c.Handler(router)
	log.Fatal(http.ListenAndServe(":6000", handler))
}
