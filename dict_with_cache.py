# Sketch of tree-based dict where tree traversal is factored out of dict operations

class DictWithCache(object):
    def __init__(self):
        self.cached_key = None
        ...

    def update_cache(key):
        assert key is not None
        if self.cached_key == key:
            return
        # Traverse tree...
        # If key is found,
        #     self.cached_node = node
        #     self.cached_adder = None
        # else
        #     self.cached_node = None
        #     self.cached_adder = ...

    def __contains__(self, key):
        self.update_cache(key)
        return node is not None

    def __getitem__(self, key):
        self.update_cache(key)
        if self.cached_node is None:
            raise KeyError(key)
        return self.cached_node.value

    def __setitem__(self, key, value):
        self.update_cache(key)
        if node is None:
            self.cached_adder(value)
        else:
            self.cached_node.value = value
