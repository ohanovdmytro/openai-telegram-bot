build:
	docker build -t openaibot .
run:
	docker run -d -p 3000:3000 --name openaibot --rm openaibot