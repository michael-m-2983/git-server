#!/bin/bash

REPO=$(echo "$PATH_INFO" | cut -d'/' -f2)
FILE_PATH=$(echo "$PATH_INFO" | cut -d'/' -f3-)

if ! echo "$REPO" | grep -qE '^[a-zA-Z0-9\-_/]+$'; then
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

# Just in case
FILE_PATH=$(echo "$FILE_PATH" | sed 's|/\.\./|/|g; s|/\./|/|g; s|^\.\./||; s|^\./||')

git --git-dir "$REPO_PATH" show HEAD:"$FILE_PATH" || {
    echo "Error: Unable to read $FILE_PATH."
    exit 1
}
