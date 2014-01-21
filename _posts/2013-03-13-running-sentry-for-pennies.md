---
layout: post
title:  "Running Sentry For Pennies"
date:   2013-03-13
categories: code
disqus: "Running Sentry For Pennies"
group: "archive"
---

_Note: The application [Sentry](http://getsentry.com), described here, is not to be confused with my own script, [Sentry](http://github.com/citruspi/Sentry), which performs a different function._

### Preface

A few months ago, I discovered [Papertrail](http://papertrailapp.com) and for the first time, I looked forward to going over my server logs every day.

I began to search for other centralized logging solutions. Two services which I found were [Splunk](#) and [Sentry](#). I\'ve had Splunk running on my Linode server for the past few months, but never got around to Sentry. I finally got around to it on Wednesday. 

The only turn off for Sentry was the pricing, so I decided to host it myself. This way, I pay pennies and I don\'t have any restrictions. Best of both worlds.

### Platform

I\'m currently running Sentry on a 32 bit Micro EC2 instance with Amazon Linux.

#### Database

Sentry requires a database and can use any of the following

- SQLite (default)
- MySQL
- Postgres

However, according to the Documentation, SQLite is _not fully supported_, so you should probably switch to Postgres or MySQL (Amazon RDS, anyone?) at some point.

I opted to stick with SQLite for now because I just wanted to get it running. I\'ll most likely setup AWS RDS in the near future.

### Installation

I\'m going to assume that, by now, you have:

- launched an instance
- downloaded the key pair
- associated an elastic ip with the instance

{% highlight bash %}
$ ssh -i ~/.ssh/public.pem ec2-user@ElasticIP
$ sudo yum install gcc python-devel
$ sudo easy_install -U sentry
{% endhighlight %}   


### Setup

After the installation has finished, run

{% highlight bash %}
$ sentry init
{% endhighlight %}   
    
A config file named `sentry.conf.py` will be created in `~/ec2-user/.sentry/`:

> Configuration file created at '/home/ec2-user/.sentry/sentry.conf.py'

You don\'t have to modify any of the settings right now, but we will later.

Now, run

{% highlight bash %}
$ sentry upgrade
{% endhighlight %}   
    
If it prints out

    You just installed Django's auth system, which means you don't have any superusers defined.
    Would you like to create one now? (yes/no): 

Enter `yes` and fill out the fields it provides. The user you create right now will be the _superuser_ for your Sentry installation.

When it finishes setting up Sentry, you\'ll be ready to go to the next section.

### Is It Up?

In your console, run

{% highlight bash %}
$ sentry start
{% endhighlight %}   
    
It should start up three workers:

{% highlight bash %}
2013-03-14 02:38:26 [1440] [INFO] Starting unicorn 0.17.2
2013-03-14 02:38:26 [1440] [INFO] Listening at: http://0.0.0.0:9000 (1440)
2013-03-14 02:38:26 [1440] [INFO] Using worker: sync
2013-03-14 02:38:26 [1449] [INFO] Booting worker with pid: 1449
2013-03-14 02:38:26 [1450] [INFO] Booting worker with pid: 1450
2013-03-14 02:38:26 [1451] [INFO] Booting worker with pid: 1451
{% endhighlight %}   

In your browser, open `ElasticIP:9000`. You should be greeted with a login prompt:

<p><a href="http://i.imgur.com/bEsUAiu.png"><img alt="" class="img-responsive" src="http://i.imgur.com/bEsUAiu.png" /></a></p>


It works!

Now, you can login, setup teams and projects, and get to work.

### Extra Credit

#### Disable Sign Ups

Right now, any one who stumbles upon your install can create an account. This isn\'t really a big problem because they\'ll be greeted with

> You are not a member of any teams in Sentry and you do not have access to create a new team.

However, it\'s still a nuisance.

To disable user registrations, just add

{% highlight python %}
SENTRY_ALLOW_REGISTRATION = False
{% endhighlight %}   

to the `sentry.conf.py` file.

You\'ll need to run

{% highlight bash %}
$ sentry upgrade
{% endhighlight %}   

again (no prompt this time) and kill and restart the Sentry process for the changes to take effect.

If you read the docs, there\'s a ton of other [config options](http://sentry.readthedocs.org/en/latest/config/index.html).

#### Reverse Proxy

I don\'t want to have to type in `http://174.129.196.120:9000/` every time, so I set up a reverse proxy with Nginx on my Linode VPS.

{% highlight nginx %}
server {
    server_name sentry.domain.com;
    access_log /you_pick/logs/access.log;
    error_log /you_pick/logs/error.log;
    
    keepalive_timeout 5;
    
    location / {
        proxy_pass         http://ElasticIP:9000;
        proxy_redirect     off;
        
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
{% endhighlight %}   
    
#### It\'s A Service

You should probably manage Sentry processes some way. I decided to go with [Supervisor](http://supervisord.org/).

If you do too, install Supervisor:

{% highlight bash %}
$ sudo easy_install supervisor
{% endhighlight %}   

Create and edit the `.conf` file:

{% highlight bash %}
$ sudo vim /etc/supervisord.conf
{% endhighlight %}   
    
and add

{% highlight bash %}
[program:sentry-web]    
command=/usr/bin/sentry start http
autostart=true
autorestart=true
redirect_stderr=true  
{% endhighlight %}   
    
to it. Then, run it with

{% highlight bash %}
$ supervisord -c /etc/supervisord.conf
{% endhighlight %}   

#### Plugins

You can extend Sentry with plugins. There are plugins for

- Bitbucket
- Campfire
- Github
- Grove.io
- Hipchat
- Notifico
- Pushover
- Trello
- WhatsApp

A full list of plugins and download links can be found [here](http://sentry.readthedocs.org/en/latest/plugins/index.html).