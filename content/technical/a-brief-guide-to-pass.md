---
draft: true
title:  "A Brief Guide to Pass"
date:   2014-02-02
url: "a-brief-guide-to-pass"
---

Until recently, I've been using [1Password][0] as my password manager. In December, when I started using a Linux desktop, I began a search for a new password manager - one that didn't require Wine to run on Linux.

### Pass: The Standard Unix Password Manager

The [website][2] describes pass as

> ...a very simple password store that keeps passwords inside gpg2(1) encrypted files... [and] ...provides a series of commands for manipulating the password store, allowing the user to add, remove, edit, synchronize, generate, and manipulate passwords.

Honestly, it's as simple as that - it's an application with a CLI which allows you to manage your passwords. **And, to put it simply, it's amazing**.

### Installation

OS X:

     $ sudo brew install pass

Fedora/RHEL:

    $ sudo yum install pass

Ubuntu/Debian:

    $ sudo apt-get install pass

Arch:

    $ pacman -S pass

In addition, there are shell completions available for the [bash][3], [zsh][4], and [fish][5] shells.

### Initializing a Password Store

The first order of business is to initialize a new password store. Since your passwords are encrypted with GPG, you'll need a GPG key at this point (if you don't have one or don't know what GPG is, I highly recommend taking a look at [Ralph Bean's GPG slides][6]).

Initialize your password store with

    $ pass init <gpgid>

*Hint: Get your key's fingerprint using*

    $ gpg --fingprint user@domain.com

### Organization of the Password Store

Passwords (and other sensitive material you choose to store with pass) are saved in separate files, one per entry. Files can be grouped in separate directories. All these files and directories are stored in your home directory, under `~.password-store/`.

Personally, I organize my "material" the way I did in 1Password - I have a folder for logins, a folder for servers, a folder for database accounts, etc. Files are titled with the account's username and the password is stored within the file. Accounts for similar services - the same website, the same server, etc - are grouped together.

### Listing Passwords

Accounts stored in pass can be listed with

    pass ls

or even

    pass

Here's an appended view of what it looks like on my machine:

```
[mihir@milou:/Users/mihir] > pass
Password Store
├── logins
│   ├── bitbucket.org
│   │   └── citruspi
│   ├── csh.rit.edu
│   │   └── mihir
│   ├── github.com
│   │   └── citruspi
│   ├── google.com
│   │   ├── me@mihirsingh.com-otp-milou
│   │   └── ms8303@rit.edu
│   ├── linode.com
│   │   └── citruspi
│   ├── riseup.net
│   │   └── citruspi
│   ├── rit.edu
│   │   └── ms8303
│   ├── themoviedb.org
│   │   └── citruspi
└── servers
    ├── brom.csh.rit.edu
    │   └── root
    ├── karaboudjan.csh.rit.edu
    │   ├── root
    │   └── mihir
    └── marlinspike.mihirsingh.com
        ├── root
        └── mihir
```

Here, `logins` and `servers` are directories in `~/.password-store`. `servers` contains the directories `bitbucket.org`, `csh.rit.edu`, etc. Each of these directories contain a GPG encrypted file which contains the password for the account specified by the file name.

If you want to list the accounts in a certain directory, use

    pass ls <directory>

### Adding Passwords

There are two ways to add new passwords to pass - `insert` and `generate`. `insert` requires a previously created password whereas `generate` will have pass [use `pwgen` to] generate a password for you.

To `insert` a password use:

    $ pass insert <account-name>

pass will then prompt you for the password to be stored.

To insert a password into a directory, simply prepend the directory name to the account name - if it doesn't exist, it will be created.

For example, to an the account for [example.com](7) and save it under the `logins` directory, I would use

    $ pass insert /logins/example.com/username

*Note that the first forward slash there isn't required and makes no difference.*

To insert multiline content, pass `--multiline` or `-m`.

Having pass generate passwords is as simple, if not simpler.

    $ pass generate <account-name> <password-length>

will generate a password of `<password-length>` length and save it as `<account-name>` and then echo it to the terminal. To copy the password to the clipboard instead of echoing it, pass `--clip` or `-c`. The password will be stored in the clipboard for forty-five seconds. If the password can't contain symbols, pass `--no-symbols` or `-n`. To overwrite an existing password, pass `--force` or `-f`.

For example, to generate a twenty-five character password for [example.com](7), save it under the `logins` directory, and copy it to my clipboard, I would use

    $ pass generate -c /logins/example.com/username 25

### Retrieving Passwords

To retrieve an existing password, you can use

    $ pass [show] <account-name>

where `[show]` is optional.

Instead of having the password echo'd to the terminal, you can pass `--clip` or `-c` to have it copied to your clipboard. As with `generate`, the password will be stored in the clipboard for forty-five seconds.

To have the password for [example.com](7) (which is stored under `logins`) copied to my clipboard, I would use

    $ pass -c /logins/example.com/username

### Editing Passwords

Edit passwords with

    $ pass edit <account-name>

### Deleting Passwords

Delete passwords with

    $ pass rm <account-name>

Pass `--recursive` or `-r` to delete a directory.

[0]: https://agilebits.com/onepassword
[1]: http://www.keepassx.org/
[2]: http://www.zx2c4.com/projects/password-store/
[3]: https://github.com/zx2c4/password-store/blob/master/contrib/pass.bash-completion
[4]: https://github.com/zx2c4/password-store/blob/master/contrib/pass.zsh-completion
[5]: https://github.com/zx2c4/password-store/blob/master/contrib/pass.fish-completion
[6]: http://threebean.org/presentations/gpg/
[7]: http://example.com
