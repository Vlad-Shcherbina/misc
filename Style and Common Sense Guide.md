#### For non-trivial regexes, add comment with an example of what they are supposed to parse.


#### Conditions in else-if chains should be uniform.

Good:
```python
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
```python
if x < 10:
    ...
elif y > 0:
    ...
elif flag and x != 15:
    ...
else:
    ...
```

#### Working with multiple (especially dependent) feature branches at the same time leads to all kinds of errors.
