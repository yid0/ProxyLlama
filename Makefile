ALPINE_NODE_VERSION ?= 20
OLLAMA_VERSION ?= 0.6.0
OPTIONS ?= --progress=plain

.PHONY:	ollama
build-ollama:
	docker buildx build -f ./Dockerfile -t yidoughi/ollama:latest . --progress=plain
	docker tag yidoughi/ollama:latest yidoughi/ollama:${OLLAMA_VERSION}

.PHONY:	build-proxyllama
build-proxyllama:
	docker buildx build -f ./Dockerfile.proxy  -t yidoughi/proxyllama:latest . --progress=plain
	docker tag yidoughi/proxyllama:latest yidoughi/proxyllama:${OLLAMA_VERSION}

.PHONY:	run-proxyllama
run-proxyllama:
	docker rm -f proxyllama || true
	docker run --name proxyllama --rm -p  3000:3000 yidoughi/proxyllama:latest

.PHONY:	run-ollama
run-ollama:
	docker rm -f ollama || true
	docker run --name ollama --rm  -e OLLAMA_DEBUG="true" -e OLLAMA_NUM_PARALLEL="4" -e OLLAMA_HOST="http://0.0.0.0:11434" -d -p 11435:11434 yidoughi/ollama:latest


.PHONY: exec-ollama
exec-ollama:
	docker exec -it ollama sh

.PHONY: exec-proxyllama
exec-proxyllama:
	docker exec -it proxyllama sh

.PHONY:	ollama
push-ollama:
		docker push docker.io/yidoughi/ollama:${OLLAMA_VERSION}
		docker push docker.io/yidoughi/ollama:latest

.PHONY:	proxyllama
push-proxyllama:
		docker push docker.io/yidoughi/proxyllama:${OLLAMA_VERSION}
		docker push docker.io/yidoughi/proxyllama:latest

.PHONY:	deploy
deploy:
	microk8s.kubectl apply -k ./deploy/

.PHONY:	deploy
stop:
	microk8s.kubectl delete -k ./deploy/

.PHONY:	expose
expose:
	microk8s.kubectl port-forward svc/proxyllama 8080:3000 && \
	microk8s.kubectl port-forward svc/proxyllama 11435:11434