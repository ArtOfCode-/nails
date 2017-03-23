# Documentation
This is the documentation for nails' public API. This also happens to be what nails uses to determine its current
version number - nails uses [semantic versioning](https://semver.org/):

 - If the public API changes and is backwards-incompatible, the major version number will increment
 - If the public API changes but is backwards compatible, the minor version number will increment. Existing nails apps
   can upgrade to the newer version and be guaranteed their behaviour won't change.
 - If a bug is fixed, the patch version number will increment.

## The Public API
Fancy way of saying "do these things to make it work", really.

 - [Config](api/config.md)
 - [Routes](api/routes.md)
 - [Controllers](api/controllers.md)
