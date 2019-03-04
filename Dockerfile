FROM node:10-alpine as build
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.15-alpine
COPY --from=build /build ./usr/share/nginx/html

# Copy the default nginx.conf
COPY --from=build /nginx.conf /etc/nginx/conf.d/default.conf