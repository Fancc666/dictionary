f = open('mywords.json', 'r')# 改成目前的文件名
g = open('mywords_.json', 'w')# 改成最终生成并使用的字库文件名
flen = len(f.readlines())
f.seek(0, 0)
g.write("response={'dictionary':[")
for x in range(flen):
    if x == flen - 1:
        g.write(f.readline())
        continue
    g.write(f.readline()[:-1]+","+"\n")
    # print(x)
g.write("]}")
f.close()
g.close()
