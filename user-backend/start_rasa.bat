@echo off
start cmd /k "rasa run --enable-api --cors '*'"
start cmd /k "rasa run actions"
