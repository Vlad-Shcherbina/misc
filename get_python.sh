set -ex

VERSION=3.4.3

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

# Finally,
#   virtualenv -p localpython/bin/python3 MY_ENV_OR_WHATEVER
# or better 
#   localpython/bin/pyvenv MY_ENV_OR_WHATEVER
