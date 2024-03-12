ecr:
	docker build -t lightdash -f dockerfile . --platform=linux/amd64   
	docker tag lightdash:latest 153390026119.dkr.ecr.eu-west-1.amazonaws.com/lightdash:latest
	docker push 153390026119.dkr.ecr.eu-west-1.amazonaws.com/lightdash:latest

update:
	git fetch upstream
	git merge upstream/main
