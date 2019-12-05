import web
import numpy as np
import cube_result_test
import cube_transform_test
import json
import kociemba
import statearray2returnmsg
urls = (
    '/(.*)', 'index'     # 首页由hello类来处理
)
class index:

    def solve(self, state):
        load_stats = json.loads(state)  # 字符串到数组
        load_stats1 = np.array(load_stats)
        load_stats2 = np.array(load_stats1).reshape((6, 9))
        # load_stats2 = cube_transform_test.js2kociemba(load_stats2)
        # state = cube_result_test.transform_result(kociemba.solve(load_stats2))
        return statearray2returnmsg.state2result(load_stats2)

    def GET(self,name):
        if name == 'solvecube':
            state = web.input()["state"]  #的来的是字符串
        else:
            white = web.input()["white"]
            yellow = web.input()["yellow"]
            orange = web.input()["orange"]
            red = web.input()["red"]
            blue = web.input()["blue"]
            green = web.input()["green"]
            state = '['+white+','+yellow+','+orange+','+red+','+blue+','+green+']'
        print(state)
        return self.solve(state)

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
    
    
