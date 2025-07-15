FROM node:current-alpine3.22 AS builder

COPY ./frontend /frontend
WORKDIR /frontend
RUN npm install && npm run build

FROM alpine:3.22.0

COPY ./lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY --chmod=755 ./cgi.sh /usr/local/bin/http-backend-script
COPY --from=builder /frontend/dist/index.html /var/www/frontend.html

RUN addgroup -S lighttpd && adduser -S lighttpd -G lighttpd \
    && apk add --no-cache git lighttpd git-daemon \
    && rm -rf /var/cache/apk/*

EXPOSE 80
VOLUME /repos
USER lighttpd

CMD [ "/usr/sbin/lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf" ]