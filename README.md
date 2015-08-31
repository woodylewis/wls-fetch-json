#wls-fetch-json

```
This replaces wls-fetch-blog, which made RESTful calls to an instance of Drupal that has been shut down. 
Content from that cms was ported into an Angular app running in an S3 bucket. The app called a Node/Express app, wls-fetch-server, which pulled the blog posts from Drupal and wrote out the JSON files now used in the S3 bucket. Those files are a placeholder for an instance of MongoDB, to be spun up in the near future.
```
bower install angular-bootstrap
```
```
bower install angular-ui-router
```
```
npm install
```
```
npm start
```
