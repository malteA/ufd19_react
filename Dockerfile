FROM mhart/alpine-node:10 as build
COPY . .
RUN npm ci --prod
RUN npm run build

FROM nginx:1.15-alpine
COPY --from=build /build ./usr/share/nginx/html

# Copy the default nginx.conf
COPY --from=build /nginx.conf /etc/nginx/conf.d/default.conf