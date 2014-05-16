For non-trivial regexes, add comment with an example of what they are supposed to parse.


Conditions in else-if chains should be uniform.

Good:
```
if x < 10:
    ...
elif x < 20:
    ...
elif x < 30:
    ...
else:
    ...
```
Bad:
```
if x < 10:
    ...
elif y > 0:
    ...
elif flag and x != 15:
    ...
else:
    ...
```
