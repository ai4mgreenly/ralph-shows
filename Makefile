INSTALL_DIR := $(HOME)/.local/share/ralph-shows

.PHONY: build install

build:
	deno task build

install: build
	mkdir -p $(INSTALL_DIR)
	cp -r dist/ $(INSTALL_DIR)/dist
	cp dev.ts $(INSTALL_DIR)/dev.ts
	cp deno.json $(INSTALL_DIR)/deno.json
