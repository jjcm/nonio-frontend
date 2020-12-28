# Color Token Levels
1. type
   1. global
   1. brand
   1. success
   1. error
 
1. objects
   1. background
   1. shadow
   1. text

1. level
   1. default
   1. subtle
   1. bold

1. variants
   1. default
   1. hover
   1. active

    
# Schema
    type | object | level | variant
i.e.
    global-text-bold-hover

Defaults are implicit and aren't needed in the token name:
YES: 
    brand-background-subtle
NO:  
    brand-background-default-subtle