COMMIT:=$(shell git log -1 --pretty=format:'%H')
BRANCH:=$(TRAVIS_BRANCH)

ifeq ($(strip $(BRANCH)),)
	BRANCH:=$(shell git branch | sed -n -e 's/^\* \(.*\)/\1/p')
endif

all: clean dist

clean:

	rm -rf dist
	rm -rf release

pygments:

	sudo pip install pygments
	
	git clone https://github.com/gthank/solarized-dark-pygments.git
	sudo python sites.py
	rm -rf solarized-dark-pygments
	

dist: clean

	hugo --theme=Orchard --destination=dist

release: dist

	mkdir release
	cd dist && zip -r ../dist.zip .

	cp dist.zip release/$(COMMIT).zip
	cp dist.zip release/$(BRANCH).zip

	rm dist.zip

.PHONY: clean pygments
