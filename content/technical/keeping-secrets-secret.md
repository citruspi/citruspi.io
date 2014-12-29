---
title:  "Keeping Secrets Secret"
date:   2013-01-27
slug: "keeping-secrets-secret"
tags:
    - git    
---

Over the past week or so, a few posts on Hacker News have popped up which demonstrate how easy it is to to find files with sensitive information like:

* wp-config.php
* secret_token.rb
* id_rsa
* id_rsa.pub
* etc.

If you make use of Google dorks and run a search for

> site:github.com master/wp_config.php password blob DB_PASSWORD

you'll get back 2,000+ results. That's a problem.

A search for

> site:github.com master/id_rsa

yields some 14,000+ results. Uh oh.

Even if _only_ half of those results are valid ([well played, sir](https://github.com/Cerberus98/ssh_keys/blob/master/id_rsa)), that's still a  lot of sensitive information floating around.

In response, Github has written a post, [Secrets in the code](https://github.com/blog/1390-secrets-in-the-code), where they say that

> Once a secret is out, it's out. There are no partially compromised secrets. If you've pushed sensitive information to a public repository, there's a good chance that it's been indexed by Google and can be searched. And with GitHub's new Search feature, it's now more easily searchable on our site.

They're right - once the cat's out the bag, its out. Of course, Github has a great article on [removing sensitive data from a repository's history](https://help.github.com/articles/remove-sensitive-data).

Unfortunately, the fact is that at some point, the page has been (most likely) cached and visited.

__You should consider the sensitive information compromised for all intents and purposes.__

There's a few ways to prevent sensitive information from becoming public.

### Environment Variables

Some of the `wp-config.php` files look like this:

```PHP
// ** MySQL settings - You can get this info from your web host ** //

/** The name of the database for WordPress */
define('DB_NAME', $_ENV['DB_NAME']);

/** MySQL database username */
define('DB_USER', $_ENV['DB_USER']);

/** MySQL database password */
define('DB_PASSWORD', $_ENV['DB_PASSWORD']);

/** MySQL hostname */
define('DB_HOST', $_ENV['DB_HOST']);

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');
```
This solution makes use of PHP's [$_ENV](http://php.net/manual/en/reserved.variables.environment.php) variables. The sensitive information isn't actually in the code, so if the `wp-config.php` file gets committed accidentally, no biggie.

Other languages also make use of environment variables - Python has `os.environ`.

The best part about environment variables is that they are language- and operating system-agnostic.

A great article on using environment variables is The Twelve-Factor App's [III. Config](http://www.12factor.net/config).

### .gitignore

But, the best solution? The simplest solution? A simple `.gitignore` file.

Simply place a file named `.gitignore` in the root of your git directory. Any _folders_ or _files_ that you list will be ignored when you commit.

So, if your `.gitignore` file looks like

```sh
# .gitignore for wordpress

wp-config.php
```

then git will ignore `wp-config.php`, leaving you free to `git add .` blindly.

<a href="http://cdn.memegenerator.net/instances/400x/33945125.jpg"><img width="100%" src="http://cdn.memegenerator.net/instances/400x/33945125.jpg" /></a>

Of course, all of this only matters if its a public repository, but it doesn't hurt to apply good security practices to private repositories as well.
