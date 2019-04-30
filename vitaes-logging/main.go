package main

import (
	"log"
	"net/http"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func vitaesLog(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	failOnError(err, "Failed to parse params")
}

func handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		vitaesLog(w, r)
	}
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handler(w, r)
	})
	log.Fatal(http.ListenAndServe(":8017", nil))
}
