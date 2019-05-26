package storage

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

const origin = "STORAGE"

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
	log.Println(email, id, origin, step, message, "")
	// logger.LogStep(email, id, origin, step, message, "")
}

func retrieveFile(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	vars := mux.Vars(r)
	email := vars["email"]
	id := vars["cvid"]

	res, err := client.Exists(id).Result()
	if err != nil {
		throwHTTPError(
			w, err, "Failed to query redis (exists)", http.StatusInternalServerError,
			email, id, "ERROR_RETRIEVE_FILE",
		)
		return
	}

	if res == 0 {
		w.WriteHeader(http.StatusNotFound)

		log.Println(email, id, origin, "PDF_NOT_READY_YET", "", "")
		// logger.LogStep(email, id, origin, "PDF_NOT_READY_YET", "", "")
	} else {
		w.WriteHeader(http.StatusAccepted)
		w.Header().Set("Content-type", "application/pdf")

		pdf, err := client.Get(id).Result()
		if err != nil {
			throwHTTPError(
				w, err, "Failed to query redis (get)", http.StatusInternalServerError,
				email, id, "ERROR_RETRIEVE_FILE",
			)
			return
		}
		w.Write([]byte(pdf))

		log.Println(email, id, origin, "PDF_RETRIEVED_FROM_REDIS", "", "")
		// logger.LogStep(email, id, origin, "PDF_RETRIEVED_FROM_REDIS", "", "")
	}
}

func storeFile(w http.ResponseWriter, r *http.Request, client *redis.Client) {
	err := r.ParseForm()
	if err != nil {
		throwHTTPError(
			w, err, "Failed to parse params", http.StatusInternalServerError,
			"", "", "ERROR_STORE_FILE",
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
			email, id, "ERROR_STORE_FILE",
		)
		return
	}

	log.Println(email, id, "STORAGE", "STORING_ON_REDIS", "", "")
	// logger.LogStep(email, id, "STORAGE", "STORING_ON_REDIS", "", "")
}

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost", "http://vitaes.io", "http://k8s.vitaes.io",
			"https://localhost", "https://vitaes.io", "https://k8s.vitaes.io",
		},
		AllowCredentials: true,
	})
	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		storeFile(w, r, client)
	}).Methods("POST")
	router.HandleFunc("/{cvid}/{email}/", func(w http.ResponseWriter, r *http.Request) {
		retrieveFile(w, r, client)
	}).Methods("GET")
	handler := c.Handler(router)
	log.Fatal(http.ListenAndServe(":6000", handler))
}
