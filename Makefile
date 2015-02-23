COMMIT:=$(shell git log -1 --pretty=format:'%H')
BRANCH:=$(TRAVIS_BRANCH)
VIRTUALENVPATH:=$(python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")

ifeq ($(strip $(BRANCH)),)
	BRANCH:=$(shell git branch | sed -n -e 's/^\* \(.*\)/\1/p')
endif

all: clean dist

clean:

	rm -rf dist
	rm -rf release

theme:

	mkdir themes
	cd themes && git clone git@github.com:citruspi/Orchard.git

	pip install pygments
	
	wget https://raw.githubusercontent.com/gthank/solarized-dark-pygments/master/solarized.py
	mv solarized.py $(VIRTUALENVPATH)/pygments/styles/.

dist: clean

	hugo --theme=Orchard --destination=dist

release: dist

	mkdir release
	cd dist && zip -r ../dist.zip .

	cp dist.zip release/$(COMMIT).zip
	cp dist.zip release/$(BRANCH).zip

	rm dist.zip

.PHONY: clean theme
