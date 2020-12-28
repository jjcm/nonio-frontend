# Color Token Levels
  1. type
    * global
    * brand
    * success
    * error

  1. objects
    * background
    * shadow
    * text

  1. level
    * default
    * subtle
    * bold

  1. variants
    * default
    * hover
    * active

    
# Schema
    type | object | level | variant
i.e.
    global-text-bold-hover

Defaults are implicit and aren't needed in the token name:
YES: 
    brand-background-subtle
NO:  
    brand-background-default-subtle