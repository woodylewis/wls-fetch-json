#wls-fetch-blog

Creates a service to retrieve a list of blog posts from http://woodylewis.com. A php script with CORS headers does a MySQL query on the blog's Drupal CMS database. List is pulled down once, and displays in the view for the list state.

Using ngClick on each list item, the individual post can be retrieved by appending the Drupal node id to the blog URL. This works because of the CORS headers. The payload is sanitized using Angular's Strict Contextual Escaping (SCE). Using ng-bind-html, it's converted from string to actual markup.

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