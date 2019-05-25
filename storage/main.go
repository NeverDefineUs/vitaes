package main

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/go-redis/redis"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func retrieveFile(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	ids, ok := r.URL.Query()["id"]
	if !ok || len(ids[0]) < 1 {
		failOnError(errors.New("param missing"), "Failed to get url params")
	}

	id := ids[0]

	res, err := client.Exists(id).Result()
	failOnError(err, "Failed to query redis")

	if res == 0 {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.WriteHeader(http.StatusAccepted)

		txt, err := client.Get(id).Result()
		failOnError(err, "Failed to query redis")
		w.Write([]byte(txt))
	}
}

func storeFile(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	err := r.ParseForm()
	failOnError(err, "Failed to parse params")

	id := r.Form.Get("id")
	content := r.Form.Get("content")

	err = client.Set(id, content, time.Duration(10)*time.Minute).Err()
	failOnError(err, "Failed to store on redis")
}

func handler(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	switch r.Method {
	case "GET":
		retrieveFile(w, r, client)
	case "POST":
		storeFile(w, r, client)
	}
}

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handler(w, r, client)
	})
	log.Fatal(http.ListenAndServe(":6000", nil))
}
