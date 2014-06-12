%include "typemaps.i"
%include "std_vector.i"
%include "std_string.i"

%module sample
%{
#include "sample.h"
%}

%include "sample.h"

%template(square_int) square<int>;
%template(square_float) square<double>;

namespace std {
%template(IntVector) vector<int>;
}
