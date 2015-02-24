---
title:  "Jekyll Deployments with Fabric"
date:   2014-02-06
url: "jekyll-deployments-with-fabric"
tags:
    - jekyll
    - fabric
---

I put together a quick [fabric][0] script yesterday to deploy this site after growing tired of manually building it and SFTP'ing it over.

An alternative method which I've used in the past would be to setup a Git repo on the server and have a post-recieve hook which builds the site and copies it over, allowing me to deploy via Git push. However, I didn't want to install Ruby on the server if it would only be used for building Jekyll sites.

{{< highlight "python" >}}
from fabric.api import *

env.user = 'user'
env.hosts = ['host']

domain = 'citruspi.io'
subdom = 'www'

def push():

    local('jekyll build')
    local('zip -r _site _site')
    run('rm -f /srv/%s/_site.zip' % (domain))
    run('rm -rf /srv/%s/_site' % (domain))
    put('_site.zip', '/srv/%s/_site.zip' % (domain))
    run('unzip /srv/%s/_site.zip -d /srv/%s' % (domain, domain))
    run('rm -rf /srv/%s/%s' % (domain, subdom))
    run('mv /srv/%s/_site /srv/%s/%s' % (domain, domain, subdom))
{{< /highlight >}}


When you run

    $ fab push

the script

1. Builds the site
2. Zips it as `_site.zip`
3. Removes `_site.zip` from the server if it exists
4. Removes `_site/` from the server if it exists
5. Copies `_site.zip` to the server
6. Unzips `_site.zip` to `_site/`
7. Removes the previous site `www/` and replaces it with `_site/`

As far as I'm concerned, this is just a temporary measure - I plan to replace this with [Ansible][1] or [Salt Stack][2] when I get some time, but deploying via fabric till then is pretty nice. I also plan to slowly move my other static sites to Jekyll, allowing me to use my deployment script(s) with as many of my static sites as possible.

[0]: http://fabfile.org
[1]: http://www.ansible.com
[2]: http://www.saltstack.com
