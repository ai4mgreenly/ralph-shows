INSTALL_DIR := $(HOME)/.local/share/ralph-shows

.PHONY: build install

build:
	deno task build

install: build
	mkdir -p $(INSTALL_DIR)
	rm -rf $(INSTALL_DIR)/dist
	cp -r dist $(INSTALL_DIR)/dist
	cp dev.ts $(INSTALL_DIR)/dev.ts
	cp deno.json $(INSTALL_DIR)/deno.json
	mkdir -p $(HOME)/.local/bin
	printf '#!/bin/sh\ncd $(INSTALL_DIR) && exec deno run -A $(INSTALL_DIR)/dev.ts\n' > $(HOME)/.local/bin/ralph-shows
	chmod +x $(HOME)/.local/bin/ralph-shows
