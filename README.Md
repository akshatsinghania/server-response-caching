# server-response-caching

caching simple api calls from github api into redis which results into faster response times

here are the results

## Without Cache

![with-cache](./images/without-cache.jpg)

## With Cache

![with-cache](./images/with-cache.jpg)

caching does provide a lot of difference , it might also help if the 3rd party api you are using have rate limitation
