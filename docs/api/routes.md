# Routes
This document covers the `routes.json` file required at the root of a Nails project.

### Format
The routes file is a JSON file. It is formatted as a top-level *array*, containing any number of route *objects*.
Any array member that is not an object is invalid; there is no guarantee of the behaviour of Nails if a non-object is
included in the routes file.

### Required Keys
In *each* route object, the following keys are **required**:

 - **`type`** *(type: `String`)*  
   Defines the HTTP method that this route will respond to. Must be one of `HEAD`, `OPTIONS`, `GET`, `POST`, `PATCH`,
   `PUT`, or `DELETE`.
 - **`url`** *(type: `String`)*  
   Defines the pathname component of the URL (after the host and before the query) that this route will respond to. A
   `url` of `/status` will respond to `/status` and to `/status?query=xyz`, but not to `/status/json`.
 - **`to`** *(type: `String`)*  
   Defines the controller and function that will handle requests that match this route. Must be provided in the format
   `controller.function`: for a route handled by the `index` function in the `status` controller, the value of this key
   should be `status.index`.

### Example File
```json
[
  { "type": "GET", "url": "/status", "to": "status.index" },
  { "type": "GET", "url": "/status/new", "to": "status.new" },
  { "type": "POST", "url": "/status/new", "to": "status.create" }
]
```
