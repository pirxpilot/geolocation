PROJECT=geolocation

all: check compile

check: lint

lint:
	jshint index.js

compile: build/build.js


build:
	mkdir -p build

build/build.js: node_modules index.js | build
	browserify --require ./index.js:$(PROJECT) --outfile $@

node_modules: package.json
	npm install

clean:
	rm -fr build

distclean: clean
	rm -fr node_modules

.PHONY: clean lint check all compile
