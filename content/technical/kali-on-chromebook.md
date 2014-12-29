---
title:  "Kali Linux on the Chromebook"
date:   2013-03-20
slug: "kali-on-chromebook"
---

### Preface

When I heard, last week, that Kali Linux 1.0 (Backtrack 6) was out, I was excited. When I got to the [download page]() and saw that there were build images for my Raspberry Pi and Samsung Chromebook, I was ecstatic.

The Kali site has an [article on installing it on the Chromebook](http://docs.kali.org/armel-armhf/install-kali-samsung-chromebook), but I couldn't get it to work. It

- has quite a few errors <sup>1</sup>
- is vague about what to do at certain points

So, having managed to get it running on my Chromebook, I figured I would document the steps I took.

### Prerequisites

- Samsung ARM Series 3 Chromebook (__Dev Mode Enabled!__)
- Another computer (to write the disk image)
- 8+ GB USB Drive or SD Card

### Download &amp; Write

Download Kali Linux for the Chromebook from [here](http://cdimage.kali.org/kali-images/kali-linux-1.0-armhf-chrome.img.gz) and extract the `.img` file from the gunzip archive.

I opted to use [Win32 Disk Imager](http://sourceforge.net/projects/win32diskimager/) to write the image to my flash drive. It can also be used to write the image to an SD Card.

### Modify

Plug your flash drive (USB 2.0 port) or SD card into the Chromebook. Open the __shell__ through the `CROSH`:

1. Control + Alt + T
2. Type in `shell` and press `return`

List the devices:

    $ lsblk | grep disk

If you have a flash drive, you should see `sda`. If you have an SD Card, it should be `mmcblk1`.

Depending on what you use, there are a different set of instructions below.

### Flash Drive

    $ sudo cgpt repair /dev/sda

    # Now, we set the priority of the boot partitions.
    $ sudo cgpt add -i 1 -T 5 -P 5 -l KERN-A /dev/sda
    $ sudo cgpt add -i 2 -T 5 -P 10 -l KERN-B /dev/sda

Now, if you run

    $ sudo cgpt show /dev/sda

it should look similar to this:

        start        size    part   contents
            0           1           PMBR
            1           1           Pri GPT header
            2          32           Pri GPT table
         8192       32768      1   Label: "KERN-A"
                                     Type: ChromeOS kernel
                                     UUID: 63AD6EC9-AD94-4B42-80E4-798BBE6BE46C
                                     Attr: priority=5 tries=5 successful=1
        40960       32768      2   Label: "KERN-B"
                                     Type: ChromeOS kernel
                                     UUID: 37CE46C9-0A7A-4994-80FC-9C0FFCB4FDC1
                                     Attr: priority=10 tries=5 successful=1
        73728     3832490      3   Label: "Linux filesystem"
                                     Type: 0FC63DAF-8483-4772-8E79-3D69D8477DE4
                                     UUID: E9E67EE1-C02E-481C-BA3F-18E721515DBB
    125045391          32           Sec GPT table
    125045423           1           Sec GPT header

Then, we enable cross system booting:

    $ sudo crossystem dev_boot_usb=1

<a href="http://i.imgur.com/fZPouot.png"><img alt="" width="100%" src="http://i.imgur.com/fZPouot.png" /></a>

### SD Card

_I have not tested these instructions yet - I've only used my flash drive. However, in theory, they should work. I'd be grateful if someone tested this and reported back._

{% highlight bash %}
$ sudo cgpt repair /dev/mmcblk1

# Now, we set the priority of the boot partitions.
$ sudo cgpt add -i 1 -T 5 -P 10 -l KERN-A /dev/mmcblk1
$ sudo cgpt add -i 2 -T 5 -P 5 -l KERN-B /dev/mmcblk1
{% endhighlight %}


Now, if you run

    $ sudo cgpt show /dev/mmcblk1

it should look similar to this:

{% highlight bash %}
    start        size    part   contents
        0           1           PMBR
        1           1           Pri GPT header
        2          32           Pri GPT table
     8192       32768      1    Label: "KERN-A"
                                     Type: ChromeOS kernel
                                     UUID: 63AD6EC9-AD94-4B42-80E4-798BBE6BE46C
                                     Attr: priority=10 tries=5 successful=1
    40960       32768      2    Label: "KERN-B"
                                     Type: ChromeOS kernel
                                     UUID: 37CE46C9-0A7A-4994-80FC-9C0FFCB4FDC1
                                     Attr: priority=5 tries=5 successful=1
    73728     3832490      3    Label: "Linux filesystem"
                                     Type: 0FC63DAF-8483-4772-8E79-3D69D8477DE4
                                     UUID: E9E67EE1-C02E-481C-BA3F-18E721515DBB
125045391          32           Sec GPT table
125045423           1           Sec GPT header
{% endhighlight %}


Then, we enable cross system booting:


{% highlight bash %}
$ sudo crossystem dev_boot_usb=1
{% endhighlight %}


### Wrap Up

When you see the _OS Verification is Off_ screen on boot up, press `Control + U` to boot into Kali Linux or `Control + D` to boot into Chrome OS (but you already knew that, right?).

Login with

<table>

    <tr>
        <td>username</td>
        <td>password</td>
    </tr>

    <tr>
        <td>root</td>
        <td>toor</td>
    </tr>

</table>

You can use `startx` to launch the GUI.

<a href="http://i.imgur.com/SX1aW1l.jpg"><img alt="" width="100%" src="http://i.imgur.com/SX1aW1l.jpg" /></a>
<a href="http://i.imgur.com/RTDDVws.jpg"><img alt="" width="100%" src="http://i.imgur.com/RTDDVws.jpg" /></a>

### Bugs

There are a few...

- Web browser doesn't work ("Failed to execute default Web Browser")
- Terminal Emulator windows disappear, leaving just the title bar (?)

### Notes

- If you swipe horizontally with two fingers, you can scroll through the different workspaces.
- Trackpad performance appears to be better than that of ChrUbuntu.

### Edit (June 13, 2013)

The steps for the SD Card installation have been [verified](/kali-on-chromebook/#comment-928592964).

---

[1]: One such error? The instructions on Kali.org reference `/dev/sdb`. However, `/dev/sdb` is the location of a flash drive plugged into an __Intel Chromebook__. The location of a flash drive on the __ARM Chromebook__ is `/dev/sda`.
