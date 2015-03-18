---
title:  "A Docset for PowerShell"
date:   2015-02-17
url: "a-docset-for-powershell"
tags:
    - powershell
    - python
    - beautifulsoup
    - scraping
    - docset
    - dash
    - cmdlet
---

Last week, a friend and I had a conversation that went something like this:

> __him__: http://kapeli.com/docset_links<br>
> __me__: Do you use Dash?<br>
> __him__: I used to<br>
> __him__: I am going to use now for c# i guess<br>
> __him__: I am trying to see if they have powershell cmdlets<br>
> __me__: I use it, particularly for languages I'm learning to look at the usage for different functions.<br>
> __me__: I feel like you could create a docset for powershell cmdlets if there isn't one.<br>
> __him__: it has all the things except for what I am looking for<br>
> __him__: yeah but I am lazy i want someone else to do that<br>

Well, challenge accepted.

After doing a quick online search to make sure that I wasn't duplicating an
existing effort, I started working on creating a docset for [Dash][0] which
documented the [PowerShell cmdlets][1].

Later that evening, or rather a couple hours into the next morning, I had a
working script which produced a docset which did just that.

<video width="100%" autoplay loop poster="/media/posts/a-docset-for-powershell/demo-poster.png">
    <source src="/media/posts/a-docset-for-powershell/demo.mp4" type="video/mp4">
    <source src="/media/posts/a-docset-for-powershell/demo.webm" type="video/webm">
</video>

<br>
# Cmdlet Reference Pages

I started by browsing the [Scripting with Windows PowerShell][2] documentation,
trying to determine the best way of finding all the documentation on cmdlets.

I decided that the easiest way, for now, would be to find all the cmdlet
reference pages. These are pages that have a list of different cmdlets, with

1. a direct link to the documentation
2. a name and
3. a description

for each cmdlet.

I ended up compiling a YAML [list of over 140 of these reference pages][3]. In
hindsight I wish I'd just taken some extra time to write the code required to
scrape the root documentation page and find all the cmdlet reference pages.

For each of these reference pages I stored the page's name and link.

{{< highlight "yaml" >}}
...
- name: CoreModulesHost
  url: https://technet.microsoft.com/en-us/library/hh849689(v=wps.640).aspx
- name: CoreModulesManagement
  url: https://technet.microsoft.com/en-us/library/hh849827(v=wps.640).aspx
- name: CoreModulesODataUtils
  url: https://technet.microsoft.com/en-us/library/dn818506(v=wps.640).aspx
- name: CoreModulesSecurity
  url: https://technet.microsoft.com/en-us/library/hh849807(v=wps.640).aspx
...
{{< /highlight >}}

# Indexing Reference Pages

Once I had the reference pages, I started working on the code to get all the
individual cmdlets. Instead of taking the logical route and scraping the table
provided, I used Beautiful Soup to scrape the table of contents on the left side
to find all the elements with `data-toclevel=2` which indicated that it was a
link to a page documenting a cmdlet.

{{< highlight "python" >}}
entries = []

for index in indexes:

    r = requests.get(index['url'])

    if r.status_code == 200:

        soup = BeautifulSoup(r.content)

        for div in soup.find_all('div'):

            try:
                if div['data-toclevel'] == '2':

                    entries.append({
                        'link': div.a.attrs['href'].strip(),
                        'title': div.a.attrs['title'],
                        'path': div.a.attrs['title']+'.html'
                    })

            except KeyError:
                pass

    else:

        print 'Failed to index {index} ({code})'.format(
                                        index = index['name'],
                                        code = r.status_code)
{{< /highlight >}}

# Downloading the Documentation

Arguably the easiest part, once I had the list of all the cmdlet documentation
pages, I proceeded to loop over the list and download each page.

{{< highlight "python" >}}
for entry in entries:

    r = requests.get(entry['link'])

    if r.status_code == 200:

        with open(entry['path'], 'w') as f:
            f.write(r.content)

    else:

        print 'Failed to download "{title}" ({code})'.format(
                                                code = r.status_code,
                                                title = title)
{{< /highlight >}}

# Rewriting the Documentation

Once I had downloaded all the pages documenting PowerShell cmdlets, I quickly
discovered I had two problems.

## Busy Documentation

The pages included the title bar and search field on the top, the table of
contents on the right, the feedback section on the bottom, etc. These were not
only unnecessary, but they affected the documentation negatively by making the
page busy.

<img src="/media/posts/a-docset-for-powershell/busy-documentation.png" width="100%"/>

I opened up the web inspector and made a list of all the elements I wanted to
remove. With that list in hand, I looped over each of the documentation pages
and used Beautiful Soup to find and remove those elements.

{{< highlight "python" >}}
for entry in entries:

    source = open(entry['path'], 'r+')

    soup = BeautifulSoup(source.read())

    unnecessary = [
        '#megabladeContainer',
        '#ux-header',
        '#isd_print',
        '#isd_printABook',
        '#expandCollapseAll',
        '#leftNav',
        '.feedbackContainer',
        '#isd_printABook',
        '.communityContentContainer',
        '#ux-footer'
    ]

    for u in unnecessary:

        if u[0] == '#':

            try:
                soup.find(id=u[1:]).decompose()
            except AttributeError:
                pass

        elif u[0] == '.':

            for element in soup.find_all('div', class_=u[1:]):
                element.decompose()

    source.seek(0)
    source.write(str(soup))
    source.truncate()
    source.close()
{{< /highlight >}}

## External Links

The documentation now looked clean, but I still had a problem. Links in the
source code used absolute paths instead of relative ones, which meant that every
link to another cmdlet opened the documentation in the web browser. This lead to

1. a poor experience
2. broken links when offline

Once again, Beautiful Soup came to the rescue. I opened up each of the
downloaded documents, looked for links to other downloaded documents, and
replaced them.

{{< highlight "python" >}}
for entry in entries:

    source = open(entry['path'], 'r+')

    soup = BeautifulSoup(source.read())

    for link in soup.find_all('a'):
        for entry in entries:
            try:
                if link.attrs['href'] == entry['link']:
                    link.attrs['href'] = entry['path']
            except KeyError:
                pass

    source.seek(0)
    source.write(str(soup))
    source.truncate()
    source.close()
{{< /highlight >}}

# The Docset

Once I had all the entries indexed and downloaded, I set about actually
creating the docset. Following [the instructions][4] on the developer's website,
I created the directory structure.

```
$ mkdir -p PowerShell.docset/Contents/Resources/Documents/
```

I placed `Info.plist` in `PowerShell.docset/Contents`.

{{< highlight "xml" >}}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>powershell</string>
    <key>CFBundleName</key>
    <string>PowerShell</string>
    <key>DocSetPlatformFamily</key>
    <string>powershell</string>
    <key>isDashDocset</key>
    <true/>
</dict>
</plist>"
{{< /highlight >}}

I copied the downloaded documentation into the required directory and then used
`sqlite3` to create and populate the necessary tables.

{{< highlight "python" >}}
path = 'PowerShell.docset/Contents/Resources/docSet.dsidx'

database = sqlite3.connect(path)

cursor = database.cursor()

try: cursor.execute('DROP TABLE searchIndex;')
except: pass

cursor.execute('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);')
cursor.execute('CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);')

inserts = [(entry['title'], 'Command', entry['path']) for entry in entries]

cursor.executemany('insert into searchIndex(name, type, path) values (?,?,?)', inserts)

database.commit()
database.close()
{{< /highlight >}}

I was then able to load `PowerShell.docset` into Dash and browse and search the
PowerShell cmdlet documentation.

# Current State

## Source Code

The code is available on [GitHub](https://github.com/citruspi/PowerShell.docset)
and dedicated to the public domain.

Assuming you have Python and `pip` installed, building it is as easy as running

```
$ make dependencies
$ make
```

once you've cloned the repository.

## Stats

When I last built it, on the 11th of March, it took about 75 minutes to build
the docset which includes 4,970 different cmdlets. The end result was ~120 MB
raw and ~10 MB once compressed.

## Installation

Since manually building it is a pain, I'm hosting a docset feed located at

```
http://powershell.docset.citruspi.io/feed/
```

[Click here][5] to have Dash subscribe to the feed.

(The feed links to a compressed copy).

I'd like to put a script together which will rebuild the docset every week,
calculate it's checksum to determine if something has changed, and automatically
update the feed.

## Future Plans

- Improve speed
- Automatic weekly updates
- Automatically parse cmdlet reference pages
- Document more than just cmdlets
- Build an index listing each cmdlet with it's description

[0]: http://kapeli.com/dash
[1]: https://technet.microsoft.com/en-us/library/bb648597%28v=vs.85%29.aspx
[2]: https://technet.microsoft.com/en-us/library/bb978526.aspx
[3]: https://github.com/citruspi/PowerShell.docset/blob/master/indexes.yaml
[4]: http://kapeli.com/docsets#dashDocset
[5]: dash-feed://http%3A%2F%2Fpowershell.docset.citruspi.io%2Ffeed%2F
