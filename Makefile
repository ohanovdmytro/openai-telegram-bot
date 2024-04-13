build:
	docker build -t openai-telegram-bot .
run:
	docker run -d -p 3000:3000 --name openai-telegram-bot --rm openai-telegram-bot