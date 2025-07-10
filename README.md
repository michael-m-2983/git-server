# git-server

> [!WARNING]
> This README is still being worked on. 

A truly lightweight git server.  

`git-server` is a simple combination of `lighttpd` and the builtin `git http-backend`, put into a docker container.

## Features

- Uncomplicated
- Small

## Drawbacks

- Single user
- No web frontend, GUI or TUI[^1]
- Doesn't have many features
- Not secure[^2]

[^1]: If you want something that is still fairly small that has a terminal UI, [soft-serve](https://github.com/charmbracelet/soft-serve) is likely a better option.
[^2]: It is intended to be put behind some kind of reverse proxy for authentication. Anonymous pushes are allowed through.

## Comparison to other git servers

## Usage

### Installation

#### Docker
#### Docker Compose
#### Non-docker

It has not been tested on non-docker systems, but it might work. Just do everything in the dockerfile manually on your system.

### Adding existing repos

Put a bunch of bare git repositories in `/repos`, and they will be added. Make sure that the config value `http.receivepack` is set to `true`, otherwise you won't be able to push.

### Creating new repos

Just add the repos as git remotes and attempt to push to them. The server will automatically create the repo.
