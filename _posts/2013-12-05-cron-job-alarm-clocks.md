---
layout: post
title:  "Cron Job Alarm Clocks"
date:   2013-12-05
categories: [linux, cron, life tips]
type: "post"
alias: [/cron-jobs-for-alarm-clocks/index.html]
---

I've been struggling to wake up on time for some time now. I could never wake up to alarm clocks - I tried iHomes, phones, etc. 

Then I went out and purchased a [Sharp SPC800 Quartz Analog Twin Bell Alarm Clock (Silver)](http://www.amazon.com/gp/product/B004ZKXY7C/ref=oh_details_o03_s00_i00?ie=UTF8&psc=1) from Amazon. That too failed to wake me up (it also had problems keeping time). Still struggling to wake up, I purchased a [Sonic Boom SBB500ss Sonic Bomb Loud Plus Vibrating Alarm Clock ](http://www.amazon.com/gp/product/B000OOWZUK/ref=oh_details_o02_s00_i00?ie=UTF8&psc=1). The alarm clock is quite loud and vibrates my whole bed... Still, no luck.

Recently, however, I have had success with a system I put together myself. I hooked up my MacBook Pro to a Pioneer Elite Shelf System and added a cronjob to raise the system volume to 100% at a certain time and play an audio file. The Pioneer's volume is always set to 100%.

My crontab currently contains this 

    00  08   *   *   *   osascript -e "set Volume 10" && afplay Train1.mp3
    

It starts to play `Train1.mp3`, a recording of a train I found online, at 8 AM.

Needless to say, not only does it wake me up, but my neighbors can

> hear and feel it

It shakes the room...

The alarm can be _"turned off"_ by muting the computer for the length of the audio file or by running 

    pkill afplay
    
Now I just need to stop going back to bed after turning it off.