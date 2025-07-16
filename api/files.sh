#!/bin/sh

REPO="${PATH_INFO#/}"

if [ -z "$REPO" ]; then
    echo "Status: 400 Bad Request"
    echo "Content-Type: text/plain"
    echo
    echo "Error: Repository name is required."
    exit 1
fi

REPO="${REPO%.git}"

if ! echo "$REPO" | grep -qE '^[a-zA-Z0-9_-]+$'; then
    echo "Status: 400 Bad Request"
    echo "Content-Type: text/plain"
    echo
    echo "Error: Invalid repository name."
    exit 1
fi

REPO_PATH="/repos/$REPO.git"

if [ ! -d "$REPO_PATH" ]; then
    echo "Status: 404 Not Found"
    echo "Content-Type: text/plain"
    echo
    echo "Error: Repository not found."
    exit 1
fi


echo "Content-type: text/plain"
echo ""

git --git-dir "$REPO_PATH" ls-tree -r HEAD --name-only