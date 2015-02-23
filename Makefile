COMMIT:=$(shell git log -1 --pretty=format:'%H')
BRANCH:=$(TRAVIS_BRANCH)

ifeq ($(strip $(BRANCH)),)
	BRANCH:=$(shell git branch | sed -n -e 's/^\* \(.*\)/\1/p')
endif

all: clean dist

clean:

	rm -rf dist
	rm -rf release

theme:

	mkdir themes
	cd themes && git clone https://github.com/citruspi/Orchard.git

	sudo pip install pygments
	
	git clone https://github.com/gthank/solarized-dark-pygments.git
	python sites.py
	#sudo mv solarized-dark-pygments/solarized.py $(VIRTUALENVPATH)/pygments/styles/.

dist: clean

	hugo --theme=Orchard --destination=dist

release: dist

	mkdir release
	cd dist && zip -r ../dist.zip .

	cp dist.zip release/$(COMMIT).zip
	cp dist.zip release/$(BRANCH).zip

	rm dist.zip

.PHONY: clean theme