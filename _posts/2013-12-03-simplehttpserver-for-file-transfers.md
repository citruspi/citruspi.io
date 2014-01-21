---
layout: post
title:  "SimpleHTTPServer for  File Transfers"
date:   2013-12-03
categories: python, tips
disqus: "Keeping Secrets Secret"
group: "archive"
---

Another student walked up to me earlier today, asking for my help in getting some files off a thumb drive and onto an Ubuntu virtual machine running on Windows. 

We tried to

- connect the thumb drive to the vm
- send the files via email

Neither worked - the vm refused to connect to the drive and Firefox in the vm refused to render Gmail properly.

My solution?

I plugged his drive into my Macbook, `cd`'ed to `/Volumes/UNTITLED` and ran

    $ python -m SimpleHTTPServer
    
I then opened `myip:8000` on his computer and downloaded the files via his web browser. 

I've never really taken the time to think about it, but when I'm on a network where I get

1. a public IPv4 address
2. gigabit speed connectivity

quickly running a `SimpleHTTPServer` is faster than pulling out a flash drive, transferring the files onto it, giving it to another person, and having them copy it to their computer.