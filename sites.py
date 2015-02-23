import site
from shutil import copyfile

for target in site.getsitepackages():

    if os.path.exists(target+'/pygments/styles'):

        copyfile('solarized-dark-pygments/solarized.py', target+'/pygments/styles')
