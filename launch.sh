#!/bin/sh
reset-repo
deno task build
clear
deno task dev
