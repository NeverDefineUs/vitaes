package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
	"github.com/neverdefineus/vitaes/lib/stolas"
	"github.com/rs/cors"
)

const origin = "STORAGE"

var stl *stolas.Client

func errMsg(err error, msg string) string {
	return fmt.Sprintf("%s: %s", msg, err)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatal(errMsg(err, msg))
	}
}

func throwHTTPError(
	w http.ResponseWriter, err error, msg string, statusCode int,
	email, id, step string,
) {
	message := errMsg(err, msg)
	http.Error(w, message, statusCode)
	stl.LogStep(email, id, origin, step, message, "")
}

func parseQueryParam(param string, r *http.Request) string {
	keys, ok := r.URL.Query()[param]
	if !ok || len(keys[0]) < 1 {
		return ""
	}
	return keys[0]
}

func retrieveFile(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	vars := mux.Vars(r)
	email := vars["email"]
	id := vars["cvid"]

	mimeContentType := parseQueryParam("mime_content_type", r)

	res, err := client.Exists(id).Result()
	if err != nil {
		throwHTTPError(
			w, err, "Failed to query redis (exists)", http.StatusInternalServerError,
			email, id, "ERROR_RETRIEVING_FILE",
		)
		return
	}

	if res == 0 {
		w.WriteHeader(http.StatusNotFound)

		stl.LogStep(email, id, origin, "FILE_NOT_READY_YET", "", "")
	} else {
		data, err := client.Get(id).Result()
		if err != nil {
			throwHTTPError(
				w, err, "Failed to query redis (get)", http.StatusInternalServerError,
				email, id, "ERROR_RETRIEVING_FILE",
			)
			return
		}
		file := []byte(data)

		w.Header().Set("Content-Type", mimeContentType)
		w.Header().Set("Content-Length", strconv.Itoa(len(file)))
		w.WriteHeader(http.StatusAccepted)
		w.Write(file)

		stl.LogStep(email, id, origin, "FILE_RETRIEVED_FROM_REDIS", "", "")
	}
}

func storeFile(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	err := r.ParseForm()
	if err != nil {
		throwHTTPError(
			w, err, "Failed to parse params", http.StatusInternalServerError,
			"", "", "ERROR_STORING_FILE",
		)
		return
	}

	email := r.Form.Get("email")
	id := r.Form.Get("id")
	content := r.Form.Get("content")

	err = client.Set(id, content, time.Duration(10)*time.Minute).Err()
	if err != nil {
		throwHTTPError(
			w, err, "Failed to store on redis", http.StatusInternalServerError,
			email, id, "ERROR_STORING_FILE",
		)
		return
	}

	stl.LogStep(email, id, "STORAGE", "STORING_ON_REDIS", "", "")
}

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	stl = stolas.NewClient("http://logger:6000/")

	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		storeFile(w, r, client)
	}).Methods("POST")
	router.HandleFunc("/{cvid}/{email}/", func(w http.ResponseWriter, r *http.Request) {
		retrieveFile(w, r, client)
	}).Methods("GET")
	handler := cors.AllowAll().Handler(router)
	log.Fatal(http.ListenAndServe(":6000", handler))
}
