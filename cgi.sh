#!/bin/sh

##################
### CGI Script ###
##################

# This is a [CGI Script](https://en.wikipedia.org/wiki/Common_Gateway_Interface) 
# that wraps around [git-http-backend](https://git-scm.com/docs/git-http-backend).

set -e # Stop the script when an error occurs

# Defines the folder in which repositories are stored
# You don't need to change this! Change the [Docker Volume](https://docs.docker.com/engine/storage/volumes/) instead.
export GIT_PROJECT_ROOT="/repos"

# "Exports" all git repos by default. Without this, each repo would need another config entry.
export GIT_HTTP_EXPORT_ALL="1"

# Extract the repo name from the request URI
#   This will look something like "my-repo-name.git" or "Organization/project-name.git"
export REPO_NAME=$(printf "$REQUEST_URI" | sed "s/^\/git\///" | sed "s/\.git.*$/.git/")
export REPO_PATH="$GIT_PROJECT_ROOT/$REPO_NAME"

# If the repo doesn't exist, create it
if [ ! -d "$REPO_PATH" ]; then

  mkdir -p "$REPO_PATH"
  git init --bare --shared --initial-branch master "$REPO_PATH" >/dev/null 2>/dev/null
  printf "[http]" >> "$REPO_PATH/config\n"
  printf "    receivepack = true" >> "$REPO_PATH/config"
fi

# Call the git-http-backend executable
exec git http-backend