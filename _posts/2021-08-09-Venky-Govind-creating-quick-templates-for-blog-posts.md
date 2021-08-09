---
layout: post
title: "Creating quick templates for blog posts"
date: 2021-08-09
tags: []
comments: false
---

## Test post for quick blogging

1. Git clone your website data.

`git clone https://github.com/webvenky/webvenky.github.io.git`

2. Install Jekyll

```
sudo apt-get install ruby-full build-essential zlib1g-dev

echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

gem install jekyll bundler

```


3. Run Local Server

`jekyll serve . --port 5000`

4. Go to a browser and type

`localhost:5000`

This gives a preview of the website.

5. Open the github package in vscode

6. Go to console and run this script: `bash create_post.sh <Post_title_string_with_Unscores_instead_of_Whitespaces>`


The script contains:
```
#!/bin/bash
# Create a new jekyll post with the current date and the given title
# and print the path to the post file.
#
# author: andreasl

post_title="$*"
[ -z "$post_title" ] && printf 'Error: Script needs a post title.\n' && exit 1

repo_dir="$(git rev-parse --show-toplevel)"
post_date="$(date '+%Y-%m-%d')"
title_slug="$(printf -- "$post_title" | sed -E 's/[^a-zA-Z0-9]+/-/g' | tr "[:upper:]" "[:lower:]")"
post_path="${repo_dir}/_posts/${post_date}-Venky-Govind-${title_slug}.md"
[ -e "$post_path" ] && printf 'Error: Post exists already.\n' && exit 2

IFS= read -r -d '' front_matter << EOF
---
layout: post
title: "${*//_/ }"
date: ${post_date}
tags: []
comments: false
---
EOF

printf -- "${front_matter}" > "${post_path}"

printf -- '%s\n' "${post_path}"

```
