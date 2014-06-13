from cpp import build_extensions
from cpp import sample


if __name__ == '__main__':
    print sample.N
    print sample.square_float(2)
    print sample.reverse([1, 2, 3])

    hz = sample.Hz()
    hz.a = 1
    hz.b = 'b'
    hz2 = sample.Hz(hz)
    hz.a = 2
    print hz, hz2
