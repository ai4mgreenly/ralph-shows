INSTALL_DIR := $(HOME)/.local/share/ralph-shows

.PHONY: build install

build:
	deno task build

install: build
	mkdir -p $(INSTALL_DIR)
	cp -r dist/ $(INSTALL_DIR)/dist
	cp serve.ts $(INSTALL_DIR)/serve.ts
	cp deno.json $(INSTALL_DIR)/deno.json
