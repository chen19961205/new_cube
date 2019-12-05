import numpy as np
# colors=['U','D','L','R','B','F']
#state字符串，直接粘贴即可

#a_s：HTML页面中魔方的state值，为长度54的数组
#返回值result：kociemba算法中可用的输入，为长度54的数组
def js2kociemba(a_s):
    colors=['U','D','R','L','F','B']
    result = ''
    # for face in [0, 3, 1, 4, 2, 5]:
    for face in [0, 2, 4, 1, 3, 5]:
        a = a_s[face]
        if(face == 0):
            for item in [8, 7, 6, 
                        5, 4, 3, 
                        2, 1, 0]:
                result += colors[a[item] // 9]
        elif(face == 1):
            for item in [8, 7, 6, 
                        5, 4, 3, 
                        2, 1, 0]:
                result += colors[a[item] // 9]
        # for item in [8, 7, 6, 
        #             5, 4, 3, 
        #             2, 1, 0]:
        #     result += colors[a[item] // 9]
        #if(face == 2):
        elif(face == 4):
            for item in range(8,-1,-1):
                result += colors[a[item] // 9]
        else:
            # for item in [2, 5, 8, 
            #              1, 4, 7, 
            #              0, 3, 6]:
            for item in range(9):
                result += colors[a[item] // 9]
    return result

if __name__ == '__main__':
    li=[33, 1, 2, 43, 4, 5, 26, 7, 8, 29, 10, 11, 46, 13, 14, 18, 16, 17, 36, 19, 47, 39, 22, 50, 42, 25, 53, 38, 41, 44, 28, 31, 34, 45, 48, 51, 9, 30, 27, 12, 40, 37, 15, 23, 20, 0, 32, 35, 3, 49, 52, 6, 21, 24]
    a_s=np.array(li).reshape((6,9))
    print(js2kociemba(a_s))