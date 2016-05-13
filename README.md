# git-issue
*Cli for creating github issues from templates*

## Usage

These commands

```sh
npm install -g git-issue

(echo "# Do Stuff" && echo "- [ ] Do it") >task.md

git-issue -r voltrevo/git-issue ./task.md
```

open this url:

https://github.com/user/repo-name/issues/new?title=Do%20Stuff%5Cn-%20%5B%20%5D%20Do%20it%5Cn&body=

which creates a new issue with title "Do Stuff" and a "Do it" task.
