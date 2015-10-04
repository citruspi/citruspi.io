COMMIT:=$(shell git log -1 --pretty=format:'%H')
BRANCH:=$(TRAVIS_BRANCH)

ifeq ($(strip $(BRANCH)),)
	BRANCH:=$(shell git branch | sed -n -e 's/^\* \(.*\)/\1/p')
endif

all: clean public

clean:

	rm -rf public
	rm -rf release

public: clean

	ljon

release: public

	mkdir release
	cd public  && zip -r ../dist.zip .

	cp dist.zip release/$(COMMIT).zip
	cp dist.zip release/$(BRANCH).zip

	rm dist.zip

server:

	ljon --server

.PHONY: clean server
