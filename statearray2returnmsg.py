from cube_result_test import transform_result
from cube_transform_test import js2kociemba
import kociemba
import numpy as np
import json

def solve_text2result_msg(solve_text):
    msg = {}
    moves_rev = []
    moves = []
    msg['solve_text'] = solve_text
    for text in solve_text:
        if text[-1] == '\'':
            moves_rev.append(text.replace('\'', '_1'))
            moves.append(text.replace('\'', '_-1'))
        else:
            moves_rev.append(text + '_-1')
            moves.append(text + '_1')
    msg['moves'] = moves
    msg['moves_rev'] = moves_rev
    return msg

#STATE:state=np.array([33, 1, 2, 43, 4, 5, 26, 7, 8, 29, 10, 11, 46, 13, 14, 18, 16, 17, 36, 19, 47, 39, 22, 50, 42, 25, 53, 38, 41, 44, 28, 31, 34, 45, 48, 51, 9, 30, 27, 12, 40, 37, 15, 23, 20, 0, 32, 35, 3, 49, 52, 6, 21, 24]).reshape((6,9))
def state2result(state):
    solve_text = transform_result(kociemba.solve(js2kociemba(state)))
    msg = solve_text2result_msg(solve_text)
    return json.dumps(msg)

if __name__ == '__main__':
    state=np.array([33, 1, 2, 43, 4, 5, 26, 7, 8, 29, 10, 11, 46, 13, 14, 18, 16, 17, 36, 19, 47, 39, 22, 50, 42, 25, 53, 38, 41, 44, 28, 31, 34, 45, 48, 51, 9, 30, 27, 12, 40, 37, 15, 23, 20, 0, 32, 35, 3, 49, 52, 6, 21, 24]).reshape((6,9))
    print(state2result(state))