# Config
This document covers the config file required at the root of a Nails project.

### Format
The configuration file can be either JavaScript or JSON (or, with a call to `require('coffee-script/register')`, can
be CoffeeScript). The JSON variant should be formatted as one top-level object containing various configuration keys
(see below for details); script variants should *export* an equivalent object.

### Required Keys
The following keys are **required** to be present in the top-level object.

 - **`server_interface`** *(type: `String`)*  
   Determines which IP address the Nails server will bind to on startup. Use `0.0.0.0` to represent an "unspecified"
   interface, which will result in the server binding to all available interfaces.
 - **`server_port`** *(type: `Integer`)*  
   Determines which port the Nails server will listen on. If this port number is below 1000, the Nails server will need
   administrative (root) access to be able to bind to the specified port; run your startup script with administrator
   privileges (i.e. through `sudo` on Linux, or from an elevated command prompt on Windows).

### Example File
**JSON:**
```json
{
  "server_interface": "127.0.0.1",
  "server_port": 8080
}
```

**JavaScript:**
```js
exports = module.exports = {
  server_interface: "127.0.0.1",
  server_port: 8080
};
```
