production: 

	jekyll build
	mv _site /tmp/_site
	rm -rf *
	mv /tmp/_site/* .
