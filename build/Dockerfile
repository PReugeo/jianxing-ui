#
# CMDB Frontend Nginx Dockerfile
#

FROM nginx:1.14.2

LABEL maintainer="tlknvr@gmail.com"

COPY dist /usr/share/nginx/html

COPY mlnet.conf /etc/nginx/conf.d/default.conf

WORKDIR /etc/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]