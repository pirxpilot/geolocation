NODE_BIN=node_modules/.bin
PROJECT=geolocation

all: check compile

check: lint

lint:
	$(NODE_BIN)/biome ci

format:
	$(NODE_BIN)/biome check --fix

compile: build/build.js

build:
	mkdir -p $@

build/build.js: node_modules index.js | build
	$(NODE_BIN)/esbuild \
		--bundle \
		--sourcemap \
		--define:DEBUG="true" \
		--global-name=$(PROJECT) \
		--outfile=$@ \
		index.js

node_modules: package.json
	yarn
	touch $@

clean:
	rm -fr build node_modules

.PHONY: clean lint check all build
