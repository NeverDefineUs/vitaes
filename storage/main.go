package main

import (
	"log"
	"net/http"
	"time"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func retrieveFile(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	vars := mux.Vars(r)
	email := vars["email"]
	id := vars["cvid"]

	res, err := client.Exists(id).Result()
	failOnError(err, "Failed to query redis")

	if res == 0 {
		w.WriteHeader(http.StatusNotFound)

		log.Println(email, id, "STORAGE", "PDF_NOT_READY_YET", "")
		// logger.LogStep(email, id, "STORAGE", "PDF_NOT_READY_YET", "")
	} else {
		w.WriteHeader(http.StatusAccepted)
		w.Header().Set("Content-type", "application/pdf")

		pdf, err := client.Get(id).Result()
		failOnError(err, "Failed to query redis")
		w.Write([]byte(pdf))

		log.Println(email, id, "STORAGE", "PDF_RETRIEVED_FROM_REDIS", "")
		// logger.LogStep(email, id, "STORAGE", "PDF_RETRIEVED_FROM_REDIS", "")
	}
}

func storeFile(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	err := r.ParseForm()
	failOnError(err, "Failed to parse params")

	email := r.Form.Get("email")
	id := r.Form.Get("id")
	content := r.Form.Get("content")

	err = client.Set(id, content, time.Duration(10)*time.Minute).Err()
	failOnError(err, "Failed to store on redis")

	log.Println(email, id, "STORAGE", "STORING_IN_REDIS", "")
	// logger.LogStep(email, id, "STORAGE", "STORING_IN_REDIS", "")
}

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		storeFile(w, r, client)
	}).Methods("POST")
	router.HandleFunc("/{cvid}/{email}/", func(w http.ResponseWriter, r *http.Request) {
		retrieveFile(w, r, client)
	}).Methods("GET")
	handler := cors.Default().Handler(router)
	log.Fatal(http.ListenAndServe(":6000", handler))
}
