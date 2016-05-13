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

https://github.com/voltrevo/git-issue/issues/new?title=Do%20Stuff&body=-%20%5B%20%5D%20Do%20it%0A

which creates a new issue with title "Do Stuff" and a "Do it" task.
