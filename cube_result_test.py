import kociemba
#输入result：kociemba算法的输出结果
#返回值new_moves：前台页面可理解的输出结果
def transform_result(result):
    s = result
    moves = s.split(' ')
    new_moves = []
    for move in moves:
        if(move == 'F'):
            new_moves.append('B')
        elif(move == 'F2'):
            new_moves.append('B')
            new_moves.append('B')
        elif(move == 'F\''):
            new_moves.append('B\'')
        elif(move == 'B'):
            new_moves.append('F')
        elif(move == 'B2'):
            new_moves.append('F')
            new_moves.append('F')
        elif(move == 'B\''):
            new_moves.append('F\'')

        elif(move == 'L'):
            new_moves.append('R')
        elif(move == 'L2'):
            new_moves.append('R')
            new_moves.append('R')
        elif(move == 'L\''):
            new_moves.append('R\'')
        elif(move == 'R'):
            new_moves.append('L')
        elif(move == 'R2'):
            new_moves.append('L')
            new_moves.append('L')
        elif(move == 'R\''):
            new_moves.append('L\'')
        elif(move == 'U2'):
            new_moves.append('U')
            new_moves.append('U')
        elif(move == 'D2'):
            new_moves.append('D')
            new_moves.append('D')
        else:
            new_moves.append(move)
    return new_moves

if __name__ == "__main__":
    print(transform_result(kociemba.solve('UURUUFUULFRBFRBFRBRRDFFDLLDDDRDDBDDLFFFLLLBBBULLUBBURR')))