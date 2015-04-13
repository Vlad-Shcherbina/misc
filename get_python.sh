set -ex

VERSION=3.4.3

curl -O --ssl-reqd https://www.python.org/ftp/python/$VERSION/Python-$VERSION.tgz
tar -zxvf Python-$VERSION.tgz

CURRENT_PATH=$PWD
cd Python-$VERSION

./configure --prefix=$CURRENT_PATH/localpython
make
make install


# and then
# virtualenv -p localpython/bin/python3 MY_ENV_OR_WHATEVER
