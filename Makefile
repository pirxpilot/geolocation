NODE_BIN=./node_modules/.bin
PROJECT=geolocation

all: check compile

check: lint

lint:
	$(NODE_BIN)/jshint index.js

compile: build/build.js

build:
	mkdir -p build

build/build.js: node_modules index.js | build
	browserify --debug --require ./index.js:$(PROJECT) --outfile $@

node_modules: package.json
	npm install && touch $@

clean:
	rm -fr build

distclean: clean
	rm -fr node_modules

.PHONY: clean distclean lint check all compile
