package main

import (
	"fmt"

	"github.com/milindmadhukar/plusxplay/server"
)

func main() {
  fmt.Println("Starting...")
	s := server.New()
	s.RunServer()
}
