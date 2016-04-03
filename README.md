misc
====

    git config --global diff.algorithm patience

    git config --global merge.conflictstyle diff3

    git config --global alias.st "status --short --branch"
    
    git config --global gui.encoding utf-8

    # from http://fredkschott.com/post/2014/02/git-log-is-so-2005/
    git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%C(bold blue)<%an>%Creset' --abbrev-commit"

    # word diff
    git config --global alias.wdiff diff --color-words
    echo '*.py diff=python' >> .gitattributes  # in the repo
