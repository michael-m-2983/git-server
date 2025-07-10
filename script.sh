#!/bin/sh

export GIT_PROJECT_ROOT="/repos"
export GIT_HTTP_EXPORT_ALL="1"

# Extract the repo name from the request URI
#   This is the second part of the path, because
#   the first part is always /git/
export REPO_NAME=$(echo $REQUEST_URI | sed "s/^\/git\///" | sed "s/\.git.*$/.git/")
export REPO_PATH="$GIT_PROJECT_ROOT/$REPO_NAME"

# If the repo doesn't exist, create it
if [ ! -d "$REPO_PATH" ]; then

  mkdir -p "$REPO_PATH"
  git init --bare --shared --initial-branch master "$REPO_PATH" >/dev/null 2>/dev/null
  echo "[http]" >> "$REPO_PATH/config"
  echo "    receivepack = true" >> "$REPO_PATH/config"
fi

git http-backend