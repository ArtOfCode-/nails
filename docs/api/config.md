# Config
This document covers the `config.json` file required at the root of a Nails project.

### Format
The config file is a JSON file. It is formatted as one top-level object, containing multiple config keys. Each key may
be one of any valid JSON type - see the key's description below for details of what type is required.

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
```json
{
  "server_interface": "127.0.0.1",
  "server_port": 8080
}
```
