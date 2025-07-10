# git-server

A truly lightweight git server.

`git-server` is a simple combination of `lighttpd` with the builtin `git http-backend` stuffed into an alpine docker base image.

## Features

- Easy to set up
- Low resource requirements
- Trying to clone or push to a nonexistant repository will create it for you

## Non-features

- There is no web UI (yet)
- It lacks many features that other setups have. If you want more features, check out [soft-serve](https://github.com/charmbracelet/soft-serve) or [ForgeJo](https://forgejo.org/).
- It does not have any kind of user authentication

## Usage

### Setup

You can setup the repository using [Docker Compose](#docker-compose), or [Docker](#docker) without compose.

If your goal is to just test out the repository and you don't want to set it up long-term, [Docker](#docker) without compose is easier.

#### Docker Compose

You have two options for docker compose:

1. Pull from GitHub

    > [!WARNING]
    > I need to create a GitHub action for this first.

2. Build locally

    There is [a docker-compose file](./docker-compose.yml) included in this repository. It attempts to use a `Dockerfile` in the same folder as itself.

    This is good if you don't trust future changes to the GitHub repository, or want to use local changes that are not present in the GitHub repository.

    To use it, clone the repository and run `docker-compose up` (or `docker-compose up -d` to run it in detached the background).

    ```bash
    git clone https://github.com/michael-m-2983/git-server
    cd git-server
    
    docker-compose up
    ```

#### Docker 

Make sure you have docker installed first.

```bash
git clone https://github.com/michael-m-2983/git-server
cd git-server

docker run \
    --rm \
    -it \
    --user $(id -u):$(id -g) \
    -p 3000:80 \
    -v "./repos:/repos" \
    $(docker build --network=host -q .)
```

The server is now running on `http://localhost:3000`.

### Creating new repos

You can create repos in two ways:

1. Moving bare repos into the volume used for storing repositories.

    This can be used to migrate from other git platforms.

    Make sure to run `git config http.receivepack true` in every bare repo, otherwise you won't be able to push. This is handled automatically with the second method.

2. Trying to clone/push/etc to a nonexistant repo

    The [cgi script](./cgi.sh) handles this by initializing a new git repo.

    Just clone something that doesn't exist: `git clone http://localhost:3000/git/this-repo-didnt-exist.git`, or add it as a remote to an existing repo and then push: `cd local-repo-not-in-server && git remote add server http://localhost:3000/git/new-repo.git && git push -u server master`.

## Contributing

Feel free to make issues and PRs.