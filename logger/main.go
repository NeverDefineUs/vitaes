package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/neverdefineus/vitaes/logger"
	"github.com/rs/cors"
)

func errMsg(err error, msg string) string {
	return fmt.Sprintf("%s: %s", msg, err)
}

func logHandler(w http.ResponseWriter, r *http.Request, logger *logger.Client) {
	err := r.ParseForm()
	if err != nil {
		http.Error(w, errMsg(err, "Failed to parse params"), http.StatusInternalServerError)
		return
	}

	email := r.Form.Get("email")
	cvHash := r.Form.Get("cv_hash")
	origin := r.Form.Get("origin")
	step := r.Form.Get("step")
	data := r.Form.Get("data")
	stacktrace := r.Form.Get("stacktrace")

	msg, err := logger.LogStep(email, cvHash, origin, step, data, stacktrace)
	if err != nil {
		http.Error(w, errMsg(err, msg), http.StatusInternalServerError)
		return
	}
}

func main() {
	logger := logger.Init()
	defer logger.Close()

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost", "http://vitaes.io", "http://k8s.vitaes.io",
			"https://localhost", "https://vitaes.io", "https://k8s.vitaes.io",
		},
		AllowCredentials: true,
	})
	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		logHandler(w, r, logger)
	}).Methods("POST")
	handler := c.Handler(router)
	log.Fatal(http.ListenAndServe(":6000", handler))
}
