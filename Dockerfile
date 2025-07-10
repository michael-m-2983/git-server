FROM alpine:3.22.0

COPY ./lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY ./script.sh /usr/local/bin/http-backend-script

RUN apk add --no-cache git lighttpd git-daemon \
    && chmod +x /usr/local/bin/http-backend-script \
    && rm -rf /var/cache/apk/* /usr/lib/libcrypto.so.3

EXPOSE 80
VOLUME /repos

# CMD ["/bin/sh"]
CMD ["/usr/sbin/lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
