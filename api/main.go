package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/streadway/amqp"
)

func errMsg(err error, msg string) string {
	return fmt.Sprintf("%s: %s", msg, err)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatal(errMsg(err, msg))
	}
}

func templatesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := ioutil.ReadDir("/vitaes/templates/")
	if err != nil {
		http.Error(w, errMsg(err, "Failed to get templates"), http.StatusInternalServerError)
		return
	}

	var templates map[string]interface{}
	templates = make(map[string]interface{})
	for _, file := range files {
		var template map[string]interface{}
		jsonFile, err := ioutil.ReadFile("/vitaes/templates/" + file.Name())
		if err != nil {
			http.Error(w, errMsg(err, "Failed to read JSON file contents"), http.StatusInternalServerError)
			return
		}
		err = json.Unmarshal(jsonFile, &template)
		if err != nil {
			http.Error(w, errMsg(err, "Failed to parse JSON file contents"), http.StatusInternalServerError)
			return
		}
		templates[template["name"].(string)] = template
	}

	templatesBytes, err := json.Marshal(templates)
	if err != nil {
		http.Error(w, errMsg(err, "Failed to marshal templates JSON"), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(templatesBytes)
}

func requestCvHandler(w http.ResponseWriter, r *http.Request, ch *amqp.Channel, q amqp.Queue) {
	body, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, errMsg(err, "Failed to parse body"), http.StatusInternalServerError)
		return
	}

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, errMsg(err, "Failed to parse json"), http.StatusInternalServerError)
		return
	}

	err = ch.Publish(
		"",     // exchange
		q.Name, // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		http.Error(w, errMsg(err, "Failed to publish a message"), http.StatusInternalServerError)
		return
	}

	cv := data["curriculum_vitae"].(map[string]interface{})
	header := cv["header"].(map[string]interface{})
	cvHash := data["path"].(string)
	email := header["email"].(string)

	log.Println(email, cvHash, "API", "SENT_TO_RABBITMQ", "")
	// logger.LogStep(email, cvHash, "API", "SENT_TO_RABBITMQ", "")

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(cvHash))
}

func main() {
	conn, err := amqp.Dial("amqp://guest:guest@rabbitmq:5672/")
	defer conn.Close()
	failOnError(err, "Failed to connect to RabbitMQ")

	ch, err := conn.Channel()
	defer ch.Close()
	failOnError(err, "Failed to open a channel")

	q, err := ch.QueueDeclare(
		"cv_requests", // name
		false,         // durable
		false,         // delete when unused
		false,         // exclusive
		false,         // no-wait
		nil,           // arguments
	)
	failOnError(err, "Failed to declare a queue")

	router := mux.NewRouter()
	router.HandleFunc("/template/", templatesHandler).Methods("GET")
	router.HandleFunc("/cv/", func(w http.ResponseWriter, r *http.Request) {
		requestCvHandler(w, r, ch, q)
	}).Methods("POST")
	handler := cors.Default().Handler(router)
	log.Fatal(http.ListenAndServe(":6000", handler))
}
