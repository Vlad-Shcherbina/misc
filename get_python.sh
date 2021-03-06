set -ex

# Dependencies, according to
# http://askubuntu.com/questions/21547/what-are-the-packages-libraries-i-should-install-before-compiling-python-from-so
sudo apt-get install --upgrade \
  build-essential \
  libz-dev \
  libreadline-dev \
  libncursesw5-dev \
  libssl-dev \
  libgdbm-dev \
  libsqlite3-dev \
  libbz2-dev \
  liblzma-dev \
  tk-dev \
  libdb-dev

VERSION=3.5.1

curl -O --ssl-reqd https://www.python.org/ftp/python/$VERSION/Python-$VERSION.tgz
tar -zxvf Python-$VERSION.tgz

CURRENT_PATH=$PWD
cd Python-$VERSION

./configure --prefix=$CURRENT_PATH/localpython
make
make install
# if install fails with the message 
# 'Ignoring ensurepip failure: pip 6.0.8 requires SSL/TLS', run
#   sudo apt-get install libssl-dev

cd ..

# Finally,
#   virtualenv -p localpython/bin/python3 MY_ENV_OR_WHATEVER
# or better 
#   localpython/bin/pyvenv MY_ENV_OR_WHATEVER
